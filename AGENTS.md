# AGENTS.md — Pipeline Orchestration Protocol

Claude Code reads this file at the start of every session to determine what to do.

## Orchestration Loop

### Step 1: Read Registry

Read `.ai/registry.yaml` to get the current pipeline state:
- `phase` — one of: `prototype`, `build`, `maintenance`
- `current_stage` — the active stage (e.g., `S0`, `S3`, `S7`)
- `status` — `pending`, `in_progress`, `judging`, `passed`, `failed`

### Step 2: Route to Agent

Based on the phase, route to the correct agent file in `.claude/agents/`.

#### Phase: `prototype`

| Condition | Agent |
|---|---|
| Clarification not complete | `infipragma-clarification` |
| Clarification complete | `infipragma-prototype` (then advance to build phase) |

#### Phase: `build`

Map `current_stage` to the corresponding agent:

| Stage | Agent | Purpose |
|---|---|---|
| S0 | `infipragma-init` | Initialize project from config |
| S1 | `infipragma-research` | Research feasibility, APIs, prior art |
| S2 | `infipragma-delivery-mode` | Choose deployment strategy |
| S3 | `infipragma-design` | Architecture and system design |
| S4 | `infipragma-scaffold` | Generate project skeleton |
| S5 | `infipragma-build` | Implement features |
| S6 | `infipragma-qa` | Test, lint, validate |
| S7 | `infipragma-deploy` | Deploy the product |

#### Phase: `maintenance`

Check `maintenance.mode` in registry.yaml and route:

| Mode | Agent | Purpose |
|---|---|---|
| `audit` | `infipragma-audit` | Self-audit for issues, populate AUDIT.md |
| `feature` | `infipragma-feature` | Implement a feature from BACKLOG.md |
| `fix` | `infipragma-fix` | Fix an issue from AUDIT.md |

### Step 3: Execute and Update

1. Load the agent file from `.claude/agents/{agent-name}.md`
2. Execute the agent's instructions
3. Update `.ai/registry.yaml` with the result (advance stage, record status)
4. Return to Step 1 for the next iteration

## Judge Gates

After each build stage completes, run the `infipragma-judge` agent before advancing to the next stage. The judge:
- Validates the stage's deliverables against acceptance criteria
- Sets status to `passed` or `failed`
- If `passed`: advance `current_stage` to the next stage
- If `failed`: remain on the current stage for a retry

## Hard Rules

- **Never skip stages.** Stages must execute in order: S0 → S1 → S2 → S3 → S4 → S5 → S6 → S7.
- **Never run two agents in parallel.** One agent runs at a time. Complete it, judge it, then move on.
