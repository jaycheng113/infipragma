---
name: Maintenance Rules
description: Protocol for when and how to update .ai/ knowledge documents
---

# Knowledge Base Maintenance Protocol

## When to Update

### Mandatory Triggers (update before session ends)

1. **New feature implemented** → Create or update `features/{name}.md`
2. **Architecture decision made** → Add ADR entry to `evolution/history.md`
3. **Dependency added or removed** → Update `core/tech-stack.md`
4. **Module created or deleted** → Update `core/architecture.md` module map
5. **Breaking interface change** → Update affected feature docs

### Recommended Triggers (update if time allows)

6. **Bug fix reveals a pattern** → Add to `evolution/tech-debt.md` (Resolved section)
7. **Tech debt created knowingly** → Add to `evolution/tech-debt.md` (Active section)
8. **Significant refactoring** → Update affected feature docs
9. **Design principle learned** → Consider adding to `core/principles.md`

### Skip Conditions (do NOT update)

- Trivial changes (typo fix, formatting, single-line bug fix)
- Changes entirely within test files with no architectural impact
- WIP/experimental code explicitly marked as throwaway

## How to Update

### Rule 1: Incremental, Not Rewrite
- Modify only the affected sections
- Append to changelogs, do not rewrite history
- Add `<!-- Updated: YYYY-MM-DD -->` at the bottom of modified files

### Rule 2: Template Compliance
- New feature docs must follow `features/_template.md`
- New ADRs must follow `templates/adr.md`

### Rule 3: Atomic Commits
- Knowledge base updates in a SEPARATE commit from code changes
- Commit message format: `docs(.ai): <what changed>`
- This allows humans to review knowledge updates independently

### Rule 4: Index Sync
- After creating or deleting any .ai/ document, update the index table in `CLAUDE.md`
- Verify file paths in the index are accurate

## Drift Detection

At the END of each session, before finalizing:

1. List all source files you modified during this session
2. For each modified file, check if it belongs to a documented module
3. If the module's feature doc does not reflect your changes:
   - Update the feature doc
   - Or note `<!-- DRIFT: description -->` if you lack context for a good update
4. If you created code in a module with NO feature doc:
   - Create one using `features/_template.md` if the module has ≥ 3 source files
   - Otherwise, note it for future documentation

## Quality Checklist (self-check before committing)

- [ ] No hallucinated file paths — every path mentioned actually exists
- [ ] No stale version numbers
- [ ] Module map entries match actual directory structure
- [ ] CLAUDE.md index entries match actual .ai/ files
- [ ] No duplicated information across documents (single source of truth)
