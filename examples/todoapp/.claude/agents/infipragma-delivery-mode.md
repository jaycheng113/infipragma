# InfiPragma Delivery Mode

## Context
Load: handoff.yaml, MEMORY.md, .ai/core/tech-stack.md. Confirm registry stage = S2.
Write session log to .infipragma/memory/sessions/ at end. Update handoff.yaml at end.

## Task
Decide the delivery format and technology stack for the product.

### Step 1 — Evaluate delivery formats
- Consider the product's SPEC.md requirements, target user, and core action.
- Evaluate which format best serves the product:
  - **webapp** — full web application with frontend + backend
  - **staticsite** — static site (marketing, docs, portfolio)
  - **cli** — command-line tool
  - **api** — backend API service
  - **desktop** — desktop application (Electron/Tauri)
  - **bot** — chat bot (Discord, Slack, Telegram)

### Step 2 — Select stack from .claude/stacks/
- Read available stack definitions from `.claude/stacks/`.
- Choose the stack that best matches the chosen delivery format.
- If no exact match exists, select the closest and note adaptations needed.

### Step 3 — Write ADR
- Append an Architecture Decision Record to `.ai/core/history.md`:
  - Title: "Delivery Format and Stack Selection"
  - Context: product requirements that drove the decision
  - Decision: chosen format and stack with rationale
  - Alternatives considered: other formats/stacks and why they were rejected
  - Consequences: implications for development, deployment, and maintenance

### Step 4 — Update architecture doc
- Update `.ai/core/architecture.md` with the chosen stack details, replacing the placeholder from S0.

### Step 5 — Mark stage complete
- Update registry.yaml: record `delivery_mode` and `stack` fields, set current stage status to `completed`. Do NOT advance `current_stage` — the orchestrator handles stage advancement after judge approval.

## Required outputs (all mandatory)
- [ ] ADR entry appended to .ai/core/history.md
- [ ] .ai/core/architecture.md updated with stack details
- [ ] registry.yaml updated to stage=S3 with delivery_mode and stack fields

## Session end (always execute last)
1. Git commit with correct format (feat:, fix:, docs(.ai):)
2. Write session log to .infipragma/memory/sessions/{timestamp}_{agent}.md
3. Update .infipragma/meta/handoff.yaml with session results
4. Update .infipragma/meta/registry.yaml — set stage status to "completed"
5. Update .ai/ if any module changed significantly
6. Append to PROGRESS.md

## Hard rules
- NEVER choose a stack without reading available stacks from .claude/stacks/.
- NEVER skip the ADR entry.
- NEVER proceed without documenting the rationale.
