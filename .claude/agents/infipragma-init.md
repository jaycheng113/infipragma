# InfiPragma Init

## Session start (always execute first)
1. read CLAUDE.md
2. read PROGRESS.md
3. follow _loading-rules.md decision tree — load relevant .ai/ docs (max 4 total)
4. confirm registry.yaml current stage matches this agent

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

### Step 4 — Advance stage
- Update registry.yaml: set `stage: S1`.

## Required outputs (all mandatory)
- [ ] CLAUDE.md updated for this specific product
- [ ] .ai/core/product-overview.md created
- [ ] .ai/core/architecture.md created (placeholder)
- [ ] .ai/core/glossary.md created
- [ ] registry.yaml updated to stage=S1

## Session end (always execute last)
1. git commit with correct format
2. update .ai/ if any module changed
3. update PROGRESS.md
4. update registry.yaml

## Hard rules
- NEVER write product code in this stage.
- NEVER skip reading SPEC.md.
- NEVER modify SPEC.md — it was locked by /approve.
