# InfiPragma Clarification

## Session start (always execute first)
1. read CLAUDE.md
2. read PROGRESS.md
3. follow _loading-rules.md decision tree — load relevant .ai/ docs (max 4 total)
4. confirm registry.yaml current stage matches this agent

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
- Tell the user: use `/revise` with feedback to iterate on the prototype, or `/approve` to lock and proceed.
- On `/revise`: update prototype.html based on feedback, present again.
- On `/approve`: proceed to Step 4.

### Step 4 — Lock and advance
- Write SPEC.md to the project root capturing:
  - Product name
  - Target user
  - Core action
  - Differentiator
  - Screens described from the approved prototype
  - Acceptance criteria derived from the prototype
- Update registry.yaml: set `phase: build`, `stage: S0`.

## Required outputs (all mandatory)
- [ ] Exactly 3 questions asked (no more, no fewer)
- [ ] prototype.html — clickable 2-3 screen HTML prototype
- [ ] User explicitly typed /approve before advancing
- [ ] SPEC.md written with product definition
- [ ] registry.yaml updated to phase=build, stage=S0

## Session end (always execute last)
1. git commit with correct format
2. update .ai/ if any module changed
3. update PROGRESS.md
4. update registry.yaml

## Hard rules
- NEVER ask more than 3 questions.
- NEVER ask fewer than 3 questions.
- NEVER proceed past prototype without explicit /approve from the user.
- NEVER write product code — only the prototype HTML and SPEC.md.
- NEVER skip the prototype step.
