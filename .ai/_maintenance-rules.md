---
name: Maintenance Rules
description: Protocol for when and how to update .ai/ knowledge documents
---

# Knowledge Base Maintenance Protocol

## When to Update

### Mandatory Triggers
1. New agent created → update features/pipeline.md
2. Agent behavior changed → update the agent file + features/pipeline.md
3. New stack added → update core/tech-stack.md
4. Architecture decision → add ADR to evolution/history.md
5. Pipeline flow changed → update core/architecture.md

### Skip Conditions
- Trivial formatting changes
- Changes only to user-facing product code (not InfiPragma itself)

## How to Update
- Incremental, not rewrite
- New ADRs must follow templates/adr.md format
- Knowledge updates in SEPARATE commit: `docs(.ai): <summary>`
- After creating/deleting .ai/ docs, update CLAUDE.md index table

## Drift Detection
At session end:
1. List modified files
2. Check if changes affect documented modules
3. Update or note `<!-- DRIFT: description -->` if needed

## Quality Checklist
- [ ] No hallucinated file paths
- [ ] CLAUDE.md index matches actual .ai/ files
- [ ] No duplicated information across documents
