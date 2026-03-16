#!/usr/bin/env bash
# InfiPragma Orchestrator — the "motor" that chains Claude Code sessions
# Usage: ./infipragma.sh [--dry-run] [--status] [--once] [--sandbox]

set -euo pipefail

# --- Configuration ---
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REGISTRY="$PROJECT_DIR/.infipragma/meta/registry.yaml"
CONFIG="$PROJECT_DIR/.infipragma/config.yaml"
AGENTS_DIR="$PROJECT_DIR/.claude/agents"
LOG_DIR="$PROJECT_DIR/.infipragma/logs"
LOCK_FILE="$PROJECT_DIR/.infipragma/meta/.session-lock"
NOTIFY="$PROJECT_DIR/.infipragma/notify.sh"

# Parse config
MAX_BUDGET=$(yq '.budget.max_per_session_usd // 15' "$CONFIG")
MAX_TOTAL=$(yq '.budget.max_total_usd // 100' "$CONFIG")
WARN_PERCENT=$(yq '.budget.warn_at_percent // 80' "$CONFIG")
MAX_RETRIES=$(yq '.orchestration.max_retries // 3' "$REGISTRY")
SESSION_TIMEOUT=$(yq '.orchestration.session_timeout // 1800' "$REGISTRY")

# Flags
DRY_RUN=false
STATUS_ONLY=false
ONCE=false
SANDBOX=false

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --status) STATUS_ONLY=true ;;
    --once) ONCE=true ;;
    --sandbox) SANDBOX=true ;;
    --help|-h)
      echo "Usage: ./infipragma.sh [--dry-run] [--status] [--once] [--sandbox]"
      echo "  --dry-run   Show what would run without executing"
      echo "  --status    Print pipeline status and exit"
      echo "  --once      Run one session only, don't loop"
      echo "  --sandbox   Run agents in Docker container"
      exit 0
      ;;
    *) echo "Unknown flag: $arg"; exit 1 ;;
  esac
done

# --- Prerequisites ---
check_prerequisites() {
  if ! command -v yq &> /dev/null; then
    echo "ERROR: yq is required. Install with: brew install yq"
    exit 1
  fi
  if ! command -v bc &> /dev/null; then
    echo "ERROR: bc is required for budget calculations. Install with: apt-get install bc"
    exit 1
  fi
  if ! command -v claude &> /dev/null; then
    echo "ERROR: claude CLI is required. Install with: npm install -g @anthropic-ai/claude-code"
    exit 1
  fi
  if [ ! -f "$REGISTRY" ]; then
    echo "ERROR: Registry file not found: $REGISTRY"
    exit 1
  fi
}

# --- Registry Helpers ---
get_phase() { yq '.phase' "$REGISTRY"; }
get_stage() { yq '.current_stage' "$REGISTRY"; }
get_stage_status() {
  local stage="$1"
  yq ".stages.${stage}.status" "$REGISTRY"
}
get_stage_retries() {
  local stage="$1"
  yq ".stages.${stage}.retries // 0" "$REGISTRY"
}
get_total_cost() { yq '.orchestration.total_cost // 0' "$REGISTRY"; }

set_registry() {
  local path="$1" value="$2"
  yq -i "${path} = ${value}" "$REGISTRY"
}

# --- Agent Routing ---
get_agent_name() {
  local phase stage
  phase=$(get_phase)
  stage=$(get_stage)

  case "$phase" in
    prototype)
      echo "infipragma-clarification"
      ;;
    build)
      local status
      status=$(get_stage_status "$stage")
      if [ "$status" = "completed" ]; then
        echo "infipragma-judge"
        return
      fi
      case "$stage" in
        S0) echo "infipragma-init" ;;
        S1) echo "infipragma-research" ;;
        S2) echo "infipragma-delivery-mode" ;;
        S3) echo "infipragma-design" ;;
        S4) echo "infipragma-scaffold" ;;
        S5) echo "infipragma-build" ;;
        S6) echo "infipragma-qa" ;;
        S7) echo "infipragma-deploy" ;;
        *) echo "ERROR: Unknown stage: $stage" >&2; exit 1 ;;
      esac
      ;;
    maintenance)
      local mode
      mode=$(yq '.maintenance.mode' "$REGISTRY")
      case "$mode" in
        audit) echo "infipragma-audit" ;;
        feature) echo "infipragma-feature" ;;
        fix) echo "infipragma-fix" ;;
        idle) echo "__idle__" ;;
        *) echo "ERROR: Unknown maintenance mode: $mode" >&2; exit 1 ;;
      esac
      ;;
    *) echo "ERROR: Unknown phase: $phase" >&2; exit 1 ;;
  esac
}

# --- Status Display ---
print_status() {
  local phase stage
  phase=$(get_phase)
  stage=$(get_stage)
  local total_cost
  total_cost=$(get_total_cost)
  local total_sessions
  total_sessions=$(yq '.orchestration.total_sessions // 0' "$REGISTRY")

  echo "========================================"
  echo "  InfiPragma Pipeline Status"
  echo "========================================"
  echo "Phase: $phase | Stage: $stage"
  echo "Total cost: \$${total_cost} / \$${MAX_TOTAL}"
  echo "Total sessions: $total_sessions"
  echo "----------------------------------------"

  local stages=("S0" "S1" "S2" "S3" "S4" "S5" "S6" "S7")
  local names=("Init" "Research" "DeliveryMode" "Design" "Scaffold" "Build" "QA" "Deploy")

  for i in "${!stages[@]}"; do
    local s="${stages[$i]}"
    local n="${names[$i]}"
    local st
    st=$(get_stage_status "$s")
    local retries
    retries=$(get_stage_retries "$s")
    local icon
    case "$st" in
      passed) icon="[PASSED]" ;;
      failed) icon="[FAILED] (retries: $retries)" ;;
      blocked) icon="[BLOCKED]" ;;
      in_progress) icon="[IN PROGRESS]" ;;
      completed) icon="[COMPLETED - awaiting judge]" ;;
      pending) icon="[PENDING]" ;;
      *) icon="[$st]" ;;
    esac

    if [ "$s" = "S5" ]; then
      local fp ft
      fp=$(yq '.stages.S5.features_passing // 0' "$REGISTRY")
      ft=$(yq '.stages.S5.features_total // 0' "$REGISTRY")
      if [ "$ft" -gt 0 ]; then
        icon="$icon ${fp}/${ft} features"
      fi
    fi

    printf "  %-3s %-14s %s\n" "$s" "$n" "$icon"
  done

  echo "----------------------------------------"
  local last_agent
  last_agent=$(yq '.orchestration.last_agent // "none"' "$REGISTRY")
  local last_run
  last_run=$(yq '.orchestration.last_run // "never"' "$REGISTRY")
  echo "Last agent: $last_agent"
  echo "Last run: $last_run"
  echo "========================================"
}

# --- Crash Recovery ---
check_crash_recovery() {
  if [ -f "$LOCK_FILE" ]; then
    local lock_info
    lock_info=$(cat "$LOCK_FILE")
    echo "WARNING: Crash detected! Previous session did not complete cleanly."
    echo "Lock info: $lock_info"
    echo "Recovering..."

    local stash_result
    stash_result=$(git -C "$PROJECT_DIR" stash 2>&1) || true
    if echo "$stash_result" | grep -q "Saved working directory"; then
      echo "WARNING: Uncommitted changes were stashed. Use 'git stash pop' to recover."
      echo "  Stash ref: $(git -C "$PROJECT_DIR" stash list | head -1)"
    fi
    git -C "$PROJECT_DIR" checkout -- "$REGISTRY" 2>/dev/null || true
    rm -f "$LOCK_FILE"
    echo "[$(date -u +%FT%TZ)] CRASH RECOVERY: $lock_info | stash: $stash_result" >> "$LOG_DIR/crashes.log"

    echo "Recovery complete. Resuming pipeline."
  fi
}

# --- Cost Check ---
check_budget() {
  local current_cost
  current_cost=$(get_total_cost)
  local warn_threshold
  warn_threshold=$(echo "$MAX_TOTAL * $WARN_PERCENT / 100" | bc -l 2>/dev/null || echo "$MAX_TOTAL")

  if [ "$(echo "$current_cost >= $MAX_TOTAL" | bc -l 2>/dev/null || echo 0)" = "1" ]; then
    echo "ERROR: Budget exceeded! \$${current_cost} >= \$${MAX_TOTAL}"
    bash "$NOTIFY" "Budget exceeded: \$${current_cost}/\$${MAX_TOTAL}. Pipeline stopped." "critical" 2>/dev/null || true
    exit 1
  fi

  if [ "$(echo "$current_cost >= $warn_threshold" | bc -l 2>/dev/null || echo 0)" = "1" ]; then
    echo "WARNING: Approaching budget limit: \$${current_cost}/\$${MAX_TOTAL}"
    bash "$NOTIFY" "Budget warning: \$${current_cost}/\$${MAX_TOTAL} (${WARN_PERCENT}% threshold)" "warning" 2>/dev/null || true
  fi
}

# --- Stage Advancement ---
advance_stage() {
  local current="$1"
  local next_stages=("S0" "S1" "S2" "S3" "S4" "S5" "S6" "S7")
  local found=false

  for i in "${!next_stages[@]}"; do
    if [ "${next_stages[$i]}" = "$current" ]; then
      local next_idx=$((i + 1))
      if [ $next_idx -lt ${#next_stages[@]} ]; then
        local next="${next_stages[$next_idx]}"
        set_registry ".current_stage" "\"$next\""
        echo "Advanced stage: $current -> $next"
      else
        set_registry ".phase" "\"maintenance\""
        set_registry ".maintenance.mode" "\"idle\""
        echo "Pipeline complete! Entering maintenance phase."
        bash "$NOTIFY" "Pipeline complete! Product deployed." "info" 2>/dev/null || true
      fi
      found=true
      break
    fi
  done

  if [ "$found" = false ]; then
    echo "ERROR: Cannot advance from unknown stage: $current"
    exit 1
  fi
}

# --- Run Agent Session ---
run_agent() {
  local agent_name="$1"
  local agent_file="$AGENTS_DIR/${agent_name}.md"
  local timestamp
  timestamp=$(date -u +%Y%m%d_%H%M%S)
  local log_file="$LOG_DIR/${timestamp}_${agent_name}.log"

  if [ ! -f "$agent_file" ]; then
    echo "ERROR: Agent file not found: $agent_file"
    return 1
  fi

  echo "Running agent: $agent_name"
  echo "Log: $log_file"

  echo "$agent_name $timestamp" > "$LOCK_FILE"

  local stage
  stage=$(get_stage)
  local retries
  retries=$(get_stage_retries "$stage" 2>/dev/null || echo "0")
  git -C "$PROJECT_DIR" tag "pre-${stage}-attempt-${retries}" HEAD 2>/dev/null || true

  set_registry ".orchestration.last_agent" "\"$agent_name\""
  set_registry ".orchestration.last_run" "\"$(date -u +%FT%TZ)\""

  local exit_code=0

  if [ "$SANDBOX" = true ]; then
    local sandbox_image
    sandbox_image=$(yq '.sandbox.image // "infipragma-sandbox"' "$CONFIG")
    timeout "$SESSION_TIMEOUT" docker run --rm \
      -v "$PROJECT_DIR:/project" \
      -e ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-}" \
      "$sandbox_image" \
      claude -p "$(cat "$agent_file")" \
        --allowedTools "Bash,Read,Write,Edit,Glob,Grep" \
        --max-turns 50 \
        --max-budget-usd "$MAX_BUDGET" \
      2>&1 | tee "$log_file" || exit_code=$?
  else
    timeout "$SESSION_TIMEOUT" claude -p "$(cat "$agent_file")" \
      --allowedTools "Bash,Read,Write,Edit,Glob,Grep" \
      --max-turns 50 \
      --max-budget-usd "$MAX_BUDGET" \
      2>&1 | tee "$log_file" || exit_code=$?
  fi

  rm -f "$LOCK_FILE"

  set_registry ".orchestration.last_exit_code" "$exit_code"
  local sessions
  sessions=$(yq '.orchestration.total_sessions // 0' "$REGISTRY")
  set_registry ".orchestration.total_sessions" "$((sessions + 1))"

  return $exit_code
}

# --- Main Loop ---
main() {
  check_prerequisites

  if [ "$STATUS_ONLY" = true ]; then
    print_status
    exit 0
  fi

  check_crash_recovery

  echo "InfiPragma Orchestrator starting..."
  echo "Project: $PROJECT_DIR"

  while true; do
    local phase agent_name stage

    phase=$(get_phase)
    stage=$(get_stage)
    agent_name=$(get_agent_name)

    if [ "$DRY_RUN" = true ]; then
      echo "[DRY RUN] Would run: $agent_name (phase=$phase, stage=$stage)"
      if [ "$phase" = "prototype" ]; then
        echo "[DRY RUN] Prototype phase requires user interaction. Cannot auto-run."
      fi
      exit 0
    fi

    if [ "$phase" = "prototype" ]; then
      echo "Prototype phase requires user interaction."
      echo "Run Claude Code manually to complete clarification and prototype approval."
      echo "Then re-run this orchestrator."
      exit 0
    fi

    if [ "$agent_name" = "__idle__" ]; then
      echo "Maintenance mode: idle. No work to do."
      print_status
      exit 0
    fi

    check_budget

    local retries
    retries=$(get_stage_retries "$stage" 2>/dev/null || echo "0")
    if [ "$retries" -ge "$MAX_RETRIES" ]; then
      echo "ERROR: Max retries ($MAX_RETRIES) reached for stage $stage"
      set_registry ".stages.${stage}.status" "\"blocked\""
      bash "$NOTIFY" "Stage $stage blocked after $MAX_RETRIES retries. Manual intervention required." "critical" 2>/dev/null || true
      print_status
      exit 1
    fi

    local exit_code=0
    run_agent "$agent_name" || exit_code=$?

    if [ $exit_code -eq 124 ]; then
      echo "TIMEOUT: Agent $agent_name exceeded ${SESSION_TIMEOUT}s"
      bash "$NOTIFY" "Timeout: $agent_name exceeded ${SESSION_TIMEOUT}s" "warning" 2>/dev/null || true
    fi

    local status
    status=$(get_stage_status "$stage" 2>/dev/null || echo "unknown")

    if [ "$agent_name" = "infipragma-judge" ]; then
      if [ "$status" = "passed" ]; then
        echo "Stage $stage PASSED!"
        git -C "$PROJECT_DIR" tag "stage-${stage}-passed" HEAD 2>/dev/null || true
        advance_stage "$stage"
        bash "$NOTIFY" "Stage $stage passed!" "info" 2>/dev/null || true
      elif [ "$status" = "failed" ]; then
        echo "Stage $stage FAILED. Incrementing retry count."
        local current_retries
        current_retries=$(get_stage_retries "$stage")
        set_registry ".stages.${stage}.retries" "$((current_retries + 1))"
        set_registry ".stages.${stage}.status" "\"pending\""
        bash "$NOTIFY" "Stage $stage failed (retry $((current_retries + 1))/$MAX_RETRIES)" "warning" 2>/dev/null || true
      fi
    fi

    if [ "$ONCE" = true ]; then
      echo "Single session mode. Stopping."
      print_status
      exit 0
    fi

    sleep 5
  done
}

main "$@"
