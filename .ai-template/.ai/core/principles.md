---
name: Design Principles
description: "Core principles: lightweight, agent-friendly, git-friendly, extensible"
layer: core
last_updated: 2026-03-15
---

# Design Principles

## 1. Lightweight by Default

**The entire system is pure markdown. No runtime, no dependencies, no build step.**

### Means
- Any project can adopt by creating a `.ai/` directory and updating `CLAUDE.md`
- No installation, no configuration beyond markdown files
- Works offline, works without internet

### Does Not Mean
- We can never add tooling — optional CLI tools can enhance the experience
- Files must be short — thoroughness is fine, bloat is not

## 2. Agent-Friendly

**Every design decision must make it easy for AI agents to read, understand, and update the knowledge base.**

### Means
- Consistent file structure with YAML frontmatter for machine-readable metadata
- Clear templates so agents produce consistent documentation
- Explicit rules (loading + maintenance) so agents know what to do without guessing
- Budget limits to prevent context window overflow

### Does Not Mean
- Human readability is secondary — documents must be useful for both humans and agents

## 3. Git-Friendly

**All knowledge is plain text, diffable, and version-controllable.**

### Means
- Every .ai/ file is tracked in git alongside the code
- Knowledge updates are committed separately (`docs(.ai): ...`) for easy review
- No binary files, no databases, no generated artifacts in .ai/
- Append-only patterns for history and changelogs (clean diffs)

### Does Not Mean
- Every micro-change needs a commit — batch updates at session end

## 4. Extensible

**Projects can customize the knowledge structure without forking.**

### Means
- The three-layer structure (core/features/evolution) is a convention, not enforcement
- Projects can add custom directories under .ai/ (e.g., .ai/api/, .ai/integrations/)
- Templates are starting points, not rigid schemas
- CLAUDE.md's index table accommodates any .ai/ file structure

### Does Not Mean
- Anything goes — the core three-layer convention should be followed unless there's a good reason

## 5. Single Source of Truth

**Each piece of knowledge lives in exactly one document.**

### Means
- Architecture overview → architecture.md only
- Module design → that module's feature doc only
- If two documents would say the same thing, one should reference the other

### Does Not Mean
- Cross-referencing is forbidden — documents can and should link to each other
- CLAUDE.md duplicating the index is a violation — the index table is a routing mechanism, not knowledge

## Changelog

### 2026-03-15
- Initial principles defined
