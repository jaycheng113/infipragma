# InfiPragma Init

## Context
Load: handoff.yaml, MEMORY.md, .ai/core/architecture.md. Confirm registry stage = S0.
Write session log to .infipragma/memory/sessions/ at end. Update handoff.yaml at end.

## Task
Initialize the project knowledge base from the locked SPEC.md.

### Step 1 — Read SPEC.md
- Parse the product name, target user, core action, differentiator, screens, and acceptance criteria.

### Step 2 — Update CLAUDE.md
- Rewrite CLAUDE.md to reflect the specific product being built.
- Include: product name, purpose, target user, key terminology, project structure conventions, and development workflow notes.
- Preserve any existing harness-level rules already in CLAUDE.md.

### Step 3 — Bootstrap .ai/ knowledge
- Create `.ai/core/` directory if it doesn't exist.
- Write initial knowledge documents:
  - `.ai/core/product-overview.md` — summarizes SPEC.md in module-doc format.
  - `.ai/core/architecture.md` — placeholder architecture doc noting decisions are pending (S2).
  - `.ai/core/glossary.md` — key terms from SPEC.md.
- Ensure each .ai/ doc follows the standard format with frontmatter (module, version, last_updated).

### Step 4 — Mark stage complete
- Update registry.yaml: set current stage status to `completed`. Do NOT advance `current_stage` — the orchestrator handles stage advancement after judge approval.

## Required outputs (all mandatory)
- [ ] CLAUDE.md updated for this specific product
- [ ] .ai/core/product-overview.md created
- [ ] .ai/core/architecture.md created (placeholder)
- [ ] .ai/core/glossary.md created
- [ ] registry.yaml updated to stage=S1

## Session end (always execute last)
1. Git commit with correct format (feat:, fix:, docs(.ai):)
2. Write session log to .infipragma/memory/sessions/{timestamp}_{agent}.md
3. Update .infipragma/meta/handoff.yaml with session results
4. Update .infipragma/meta/registry.yaml — set stage status to "completed"
5. Update .ai/ if any module changed significantly
6. Append to PROGRESS.md

## Hard rules
- NEVER write product code in this stage.
- NEVER skip reading SPEC.md.
- NEVER modify SPEC.md — it was locked by APPROVE.
