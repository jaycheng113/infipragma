---
name: CLAUDE.md Template
description: Template for creating CLAUDE.md when adopting AgentInfra in a project
---

# {Project Name}

{One sentence: what this project is and does.}

## Knowledge Base (.ai/)

Before starting any task, read the relevant documents from `.ai/`.

| Document | Description |
|----------|-------------|
| .ai/core/architecture.md | {System architecture, module boundaries, data flow} |
| .ai/core/principles.md | {Design principles and decision framework} |
| .ai/core/tech-stack.md | {Languages, frameworks, key dependencies and rationale} |
| .ai/evolution/history.md | {Development history and architecture decision records} |
| .ai/evolution/roadmap.md | {Planned features and milestones} |
| .ai/evolution/tech-debt.md | {Known technical debt and improvement backlog} |

<!-- Add feature docs as they are created: -->
<!-- | .ai/features/{name}.md | {description} | -->

## Loading Protocol

1. Always read this file (auto-loaded by Claude Code)
2. Read `.ai/_loading-rules.md` and follow its decision tree to load relevant documents
3. Do not load documents speculatively — only load what the decision tree indicates

## Maintenance Protocol

After completing significant work, follow `.ai/_maintenance-rules.md`:
- New feature implemented → create/update `features/{name}.md`
- Architecture decision made → add ADR to `evolution/history.md`
- Dependency added/removed → update `core/tech-stack.md`
- Module created/deleted → update `core/architecture.md`

## Rules

1. {Add project-specific rules here}
2. Keep .ai/ documents concise — aim for < 200 lines per document
3. Use YAML frontmatter on all .ai/ documents
4. Commit knowledge updates separately: `docs(.ai): <summary>`

## Quick Reference

- Build: `{your build command}`
- Test: `{your test command}`
- Dev server: `{your dev server command}`
