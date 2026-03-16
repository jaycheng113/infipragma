# AgentInfra

Structured .md knowledge layer for AI agents. Pure markdown, CLAUDE.md-driven, three-layer loading.

## Knowledge Base (.ai/)

Before starting any task, read the relevant documents from .ai/.

| Document | Description |
|----------|-------------|
| .ai/_loading-rules.md | Decision tree for which documents to load based on task type |
| .ai/_maintenance-rules.md | Protocol for when and how to update knowledge documents |
| .ai/core/architecture.md | System design: .ai/ directory structure, three-layer loading, maintenance protocol |
| .ai/core/principles.md | Design principles: lightweight, agent-friendly, git-friendly, extensible |
| .ai/core/tech-stack.md | Tech choices: pure Markdown, YAML frontmatter, CLAUDE.md-driven |
| .ai/features/_template.md | Template for creating new feature documentation |
| .ai/evolution/history.md | Development history and architecture decision records |
| .ai/evolution/roadmap.md | Planned features and milestones |
| .ai/evolution/tech-debt.md | Known technical debt |
| .ai/templates/adr.md | Architecture Decision Record template |
| .ai/templates/claude-md.md | CLAUDE.md template for adopting AgentInfra |
| .ai/templates/init-core.md | Guide for bootstrapping the core layer |

## Loading Protocol

1. Always read this file (auto-loaded by Claude Code)
2. Read `.ai/_loading-rules.md` and follow its decision tree to load relevant documents
3. Do not load documents speculatively — only load what the decision tree indicates

## Maintenance Protocol

After completing significant work, follow `.ai/_maintenance-rules.md`:
- New content created → update relevant .ai/ docs
- Architecture decision made → add ADR to history.md
- Template changed → update affected template files

## Rules

1. All content is in English
2. Keep .md files concise — aim for < 200 lines per document
3. Use YAML frontmatter on all .ai/ documents
4. Commit knowledge updates separately from code: `docs(.ai): <summary>`
5. This project documents itself using its own .ai/ system

## Quick Reference

- No build step — pure markdown
- Validate structure: check all .ai/ files have frontmatter
- Test: open a new Claude Code session and verify the agent loads knowledge correctly
