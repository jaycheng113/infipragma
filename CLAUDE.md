# CLAUDE.md — InfiPragma L1 Entry Point

## Project Identity

InfiPragma is an autonomous product delivery harness for Claude Code. It takes a user's idea and autonomously delivers a deployed, maintained product. Users clone this repo, fill in `config.yaml`, and tell Claude Code to start.

## Knowledge Base (.ai/) Index

| Document | Path | Purpose |
|---|---|---|
| Loading Rules | `.ai/_loading-rules.md` | Decision tree for session startup |
| Maintenance Rules | `.ai/_maintenance-rules.md` | Protocol for maintenance phase |
| Project Spec | `.ai/project-spec.md` | User's product specification |
| Architecture | `.ai/architecture.md` | System architecture decisions |
| Tech Stack | `.ai/tech-stack.md` | Chosen technologies and rationale |
| Delivery Mode | `.ai/delivery-mode.md` | Deployment strategy |
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

- **All content, output, commit messages, and communication MUST be in English. Never use any other language regardless of system locale or user language settings.**
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
