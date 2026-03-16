# Infipragma — Briefing

You are scaffolding **Infipragma**: a Claude Code harness that takes a user's idea and autonomously delivers a deployed, maintained product.

Users interact with this harness by cloning it, filling in `config.yaml`, and telling Claude Code to start. Everything else is automatic.

---

## Four Core Principles

1. **Idea is product** — one sentence starts everything, no technical decisions required from the user
2. **Prototype before building** — 30min alignment session before 24hr unattended build
3. **Git-style product versioning** — every change produces a product-level commit, not just a code diff
4. **Autonomous maintenance** — after delivery, the product audits, fixes, and extends itself

---

## How It Runs

Claude Code reads `AGENTS.md` → checks `registry.yaml` for current phase and stage → reads the corresponding `.claude/agents/` file → executes it → updates `registry.yaml` → repeats.

No servers. No databases. No code outside of markdown files.

---

## Phase 0 — Prototype Validation (user present, ~30 min)

**Goal**: align on what to build before building it.

```
Clarification Agent
  → asks exactly 3 questions: who uses it / core action / difference from existing tools
  → never asks more than 3

Prototype Agent
  → generates a clickable 2-3 screen HTML prototype with fake data
  → user types REVISE "..." to iterate, or APPROVE to lock

On APPROVE:
  → SPEC.md is written and locked
  → registry.yaml phase changes to "build"
  → pipeline starts
```

---

## Phase 1 — Build Pipeline (unattended, ~24hr)

Each stage ends with a judge gate. Judge fail → fix and retry. Judge pass → advance.

```
S0  Init          read SPEC.md → write CLAUDE.md → bootstrap .ai/ knowledge base
S1  Research      web search → competitive analysis → write MARKET.md + ADR#001
S2  DeliveryMode  decide output format: webapp / staticsite / cli / api / desktop / bot
                  select matching stack template from .claude/stacks/
S3  Design        generate feature_list.json (20+ features, all passes=false)
                  categories: core / enhanced / polish, each with priority + steps array
S4  Scaffold      create project from stack template → write init.sh → git init → first commit
S5  BuildLoop     repeat until all core features pass:
                    read PROGRESS.md → run init.sh → pick highest-priority failing feature
                    implement → Puppeteer E2E test using feature's steps array
                    pass: set passes=true, git commit, update .ai/, update PROGRESS.md
                    fail: git revert, retry
S6  QA            full regression on all passing features + Lighthouse + security scan
S7  Deploy        deploy using stack template config → write DELIVERY.md → notify user
```

**Build Loop hard rules:**
- One feature per session, never more
- Only change `passes` field in feature_list.json, never delete or edit other fields
- Only mark passes=true after Puppeteer confirms end-to-end, never by assumption
- Every session must end with: git commit + PROGRESS.md update + .ai/ drift check

---

## Phase 2 — Maintenance (unattended, indefinite)

Triggered automatically. Three agents, each independent.

```
Audit Agent   runs on schedule (daily or weekly)
              checks: feature regression / Lighthouse / npm audit / linter / .ai/ drift
              writes findings to AUDIT.md
              never fixes anything — diagnosis only

Feature Agent triggered when BACKLOG.md has Pending items
              reads .ai/ for full context before touching any code
              implements one item, tests it, moves it to Done in BACKLOG.md

Fix Agent     triggered when AUDIT.md has unresolved warnings or criticals
              reads .ai/ for context
              patches the issue, verifies fix, marks resolved in AUDIT.md
```

Every maintenance session ends with: git commit + .ai/ update + CHANGELOG entry + user notification.

---

## Files to Create

### Root
```
CLAUDE.md              AgentInfra L1 entry — agent reads this first every session
AGENTS.md              orchestration protocol — which agent runs based on registry state
PROGRESS.md            session handoff log — must be updated at end of every session
BACKLOG.md             new requirements queue — user writes here, Feature Agent reads
AUDIT.md               self-discovered issues — Audit Agent writes, Fix Agent reads
CHANGELOG.md           product-readable history — auto-appended each maintenance run
BRIEFING.md            this file
```

### .infipragma/
```
config.yaml            user fills this: idea + optional hints + optional notify config
feature_list.json      populated by Design Agent — all features, all starts as false
meta/registry.yaml     pipeline state: phase + current_stage + per-stage status
```

### .claude/agents/
```
infipragma-clarification.md
infipragma-init.md
infipragma-research.md
infipragma-delivery-mode.md
infipragma-design.md
infipragma-scaffold.md
infipragma-build.md
infipragma-qa.md
infipragma-deploy.md
infipragma-audit.md
infipragma-feature.md
infipragma-fix.md
infipragma-judge.md
```

### .claude/skills/
```
status/SKILL.md        /status — pipeline progress report
review/SKILL.md        /review — trigger immediate audit
catchup/SKILL.md       /catchup — fast context recovery using .ai/
feature/SKILL.md       /feature "..." — append to BACKLOG.md
```

### .claude/stacks/
```
webapp.yaml            Next.js 14 + Supabase + Vercel
staticsite.yaml        Astro + Netlify
cli.yaml               Python + PyPI
api.yaml               FastAPI + Railway
desktop.yaml           Tauri + GitHub Releases
bot.yaml               Discord.js or Telegram + Railway
```

### .ai/ (AgentInfra knowledge layer)
```
_loading-rules.md      decision tree: which task loads which docs (max 4 per session)
_maintenance-rules.md  when and how to update knowledge + drift detection protocol
core/
  architecture.md
  principles.md
  tech-stack.md
features/
  _template.md
evolution/
  history.md           ADR log, append-only
  roadmap.md
  tech-debt.md
templates/
  adr.md
  claude-md.md
  init-core.md
```

---

## Key File Formats

### registry.yaml
```yaml
phase: "prototype"        # prototype | build | maintenance
current_stage: "clarification"
stages:
  S0: { status: pending }
  S1: { status: pending }
  S2: { status: pending }
  S3: { status: pending }
  S4: { status: pending }
  S5: { status: pending, features_total: 0, features_passing: 0 }
  S6: { status: pending }
  S7: { status: pending, live_url: null }
maintenance:
  mode: idle              # idle | auditing | implementing | fixing
  last_audit: null
  next_audit: null
  open_items: 0
```

### config.yaml
```yaml
idea: ""                  # describe your product here — one sentence or a paragraph
hints: ""                 # optional: "prefer Python", "must work offline", etc.
notify:
  telegram: ""            # optional bot token
  email: ""               # optional
```

### feature_list.json entry
```json
{
  "id": "core-001",
  "category": "core",
  "priority": 1,
  "module": "auth",
  "description": "user can register with email and password",
  "steps": [
    "navigate to /signup",
    "fill in email and password fields",
    "click Register button",
    "verify redirect to dashboard",
    "verify auth token exists in localStorage"
  ],
  "passes": false
}
```

### PROGRESS.md entry format
```
## Session {N} — {date}
**Done:** {what was implemented}
**Tests:** {what passed / what failed}
**Blocked:** {any issues encountered}
**Next:** {exact next action for the following session}
```

### Product-level git commit format
```
product: v{x.y.z} — {one-line description}

Changes:
  + {added}
  ~ {modified}
  fix: {fixed}

Regression: {n}/{total} core features passing
```

### .ai/ commit format
```
docs(.ai): {summary of knowledge update}
```

---

## Agent File Structure

Every agent file must follow this structure:

```markdown
# {Agent Name}

## Session start (always execute first)
1. read CLAUDE.md
2. read PROGRESS.md
3. follow _loading-rules.md decision tree — load relevant .ai/ docs (max 4 total)
4. confirm registry.yaml current stage matches this agent

## Task
{what to do}

## Required outputs (all mandatory)
- [ ] file or action 1
- [ ] file or action 2

## Session end (always execute last)
1. git commit with correct format
2. update .ai/ if any module changed
3. update PROGRESS.md
4. update registry.yaml

## Hard rules
{what is forbidden}
```

---

## Judge Agent Criteria (examples)

```
S4 → S5:
  - init.sh exists and is executable
  - bash init.sh succeeds, dev server starts
  - git initialized with initial commit
  - PROGRESS.md exists
  - score < 7 → automatic fail

S5 → S6:
  - all category=core features have passes=true
  - no console.error in running app
  - PROGRESS.md updated this session
  - score < 7 → automatic fail
```

Judge output format:
```yaml
stage: S{N}
verdict: pass | fail
score: 0-10
issues:
  - severity: critical | warning
    description: "..."
    fix: "exact instruction to fix"
next_action: "proceed to S{N+1}" | "fix issues and re-run judge"
```

---

## AgentInfra Rules

- Max 4 .ai/ documents per session (CLAUDE.md counts as 1)
- After modifying a module, update .ai/features/{module}.md
- Architecture decisions → .ai/evolution/history.md in ADR format
- Technical debt → .ai/evolution/tech-debt.md
- .ai/ updates always in a separate commit: `docs(.ai): ...`
- Never delete .ai/ entries — append or update only
