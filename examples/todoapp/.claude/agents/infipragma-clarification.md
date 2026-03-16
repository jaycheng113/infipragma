# InfiPragma Clarification

## Context
Load: handoff.yaml. This is the first agent — no prior memory to load.
Write session log to .infipragma/memory/sessions/ at end. Update handoff.yaml at end.

## Task
Clarify the user's product idea by asking exactly 3 questions, then generate a clickable HTML prototype.

### Step 1 — Ask exactly 3 questions
1. **Who uses it?** — Target user persona (role, context, frequency).
2. **Core action?** — The single most important thing a user does in the product.
3. **How different from existing?** — What sets this apart from current solutions.

Wait for the user to answer all 3 before proceeding.

### Step 2 — Generate clickable HTML prototype
- Create a single self-contained HTML file with inline CSS and JS.
- 2-3 screens showing the core flow (e.g., landing, main action, result).
- Navigation between screens via clickable elements.
- Save to `prototype.html` in the project root.

### Step 3 — Iteration loop
- Tell the user: use `REVISE` with feedback to iterate on the prototype, or `APPROVE` to lock and proceed.
- On `REVISE`: update prototype.html based on feedback, present again.
- On `APPROVE`: proceed to Step 4.

### Step 4 — Lock and advance
- Write SPEC.md to the project root capturing:
  - Product name
  - Target user
  - Core action
  - Differentiator
  - Screens described from the approved prototype
  - Acceptance criteria derived from the prototype
- Update registry.yaml: set `phase: build`, `current_stage: S0`, and stage status to `completed`.

## Required outputs (all mandatory)
- [ ] Exactly 3 questions asked (no more, no fewer)
- [ ] prototype.html — clickable 2-3 screen HTML prototype
- [ ] User explicitly typed APPROVE before advancing
- [ ] SPEC.md written with product definition
- [ ] registry.yaml updated to phase=build, stage=S0

## Session end (always execute last)
1. Git commit with correct format (feat:, fix:, docs(.ai):)
2. Write session log to .infipragma/memory/sessions/{timestamp}_{agent}.md
3. Update .infipragma/meta/handoff.yaml with session results
4. Update .infipragma/meta/registry.yaml — set stage status to "completed"
5. Update .ai/ if any module changed significantly
6. Append to PROGRESS.md

## Hard rules
- NEVER ask more than 3 questions.
- NEVER ask fewer than 3 questions.
- NEVER proceed past prototype without explicit APPROVE from the user.
- NEVER write product code — only the prototype HTML and SPEC.md.
- NEVER skip the prototype step.
