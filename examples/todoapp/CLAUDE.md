# CLAUDE.md — TodoApp (InfiPragma Project)

## Product Identity

**TodoApp** is a simple, single-page todo list web application. Users can add, complete, and delete tasks. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools.

- **Target User**: Anyone needing lightweight browser-based task management
- **Core Action**: Add, complete, and delete tasks
- **Tech Constraint**: Vanilla HTML/CSS/JS only, single page, no dependencies

## Project Structure

```
.ai/core/           — Product knowledge (overview, architecture, glossary)
.infipragma/        — Pipeline state, config, memory, session logs
```

## Key Terminology

- **Task**: A to-do item with text and completion state
- **Complete**: Mark a task as done (visual distinction)
- **SPA**: Single Page Application — no navigation, one HTML page

## Development Workflow

- All UI in a single `index.html` (or minimal file set)
- No build step — open in browser to test
- No external dependencies

## Knowledge Base (.ai/) Index

| Document | Path | Purpose |
|---|---|---|
| Product Overview | `.ai/core/product-overview.md` | Product summary and acceptance criteria |
| Architecture | `.ai/core/architecture.md` | System architecture decisions (pending S2) |
| Glossary | `.ai/core/glossary.md` | Key terms and definitions |
| Loading Rules | `.ai/_loading-rules.md` | Decision tree for session startup |
| Maintenance Rules | `.ai/_maintenance-rules.md` | Protocol for maintenance phase |
| Registry | `.infipragma/meta/registry.yaml` | Pipeline state — current phase, stage, status |
| Config | `.infipragma/config.yaml` | User-provided project configuration |
| Handoff | `.infipragma/meta/handoff.yaml` | Session-to-session continuity data |
| Memory | `.infipragma/memory/MEMORY.md` | Long-term project memory |
| Error Experience | `.infipragma/memory/errors/` | Learned error patterns |

## Loading Protocol

1. Read this file (CLAUDE.md)
2. Read `.ai/_loading-rules.md` for the session startup decision tree
3. Follow the decision tree to determine what to do next

## Maintenance Protocol

Follow `.ai/_maintenance-rules.md` when the pipeline is in the maintenance phase.

## Orchestration

Read `AGENTS.md` for the full pipeline orchestration protocol. Claude Code reads AGENTS.md every session to determine which agent to run based on the current phase and stage in `registry.yaml`.

## Rules

- All content must be in English
- Keep `.ai/` documents concise and focused
- Use YAML frontmatter in `.ai/` docs where applicable
- Make separate commits for each logical change
- Never modify `registry.yaml` outside of the orchestration protocol

## Shared Agent Protocol

All agents follow this protocol when running via the orchestrator:

### Session Start
1. Read `.infipragma/meta/handoff.yaml` for continuity from previous session
2. Read `.infipragma/memory/MEMORY.md` for long-term project context
3. Confirm `registry.yaml` current stage matches this agent
4. Check `.infipragma/memory/errors/` for relevant past errors

### Session End
1. Git commit with correct format (`feat:`, `fix:`, `docs(.ai):`)
2. Write session log to `.infipragma/memory/sessions/{timestamp}_{agent}.md`
3. Update `.infipragma/meta/handoff.yaml` with session results
4. Update `.infipragma/meta/registry.yaml` status to `completed`

### On Error Resolution
- Write error experience to `.infipragma/memory/errors/{error-id}.md`
- Include: symptom, root cause, fix, related features

## Quick Reference

1. Clone this repository
2. Fill in `config.yaml` with your product idea and preferences
3. Run Claude Code — it will read CLAUDE.md, load the pipeline, and begin autonomous delivery
