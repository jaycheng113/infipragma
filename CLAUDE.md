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
| Registry | `.ai/registry.yaml` | Pipeline state — current phase, stage, status |
| Config | `config.yaml` | User-provided project configuration |

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

## Quick Reference

1. Clone this repository
2. Fill in `config.yaml` with your product idea and preferences
3. Run Claude Code — it will read CLAUDE.md, load the pipeline, and begin autonomous delivery
