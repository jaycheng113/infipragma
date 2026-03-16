---
name: Technology Stack
description: "Pure Markdown, YAML frontmatter, CLAUDE.md-driven, no runtime dependencies"
layer: core
last_updated: 2026-03-15
---

# Technology Stack

## Core Technology

| Technology | Purpose | Why This One |
|-----------|---------|-------------|
| Markdown (.md) | All knowledge documents | Universal, human/agent readable, git-friendly, zero tooling needed |
| YAML Frontmatter | Document metadata | Standard convention in static site generators and documentation tools |
| CLAUDE.md | Entry point / router | Auto-loaded by Claude Code on every session — no configuration needed |

## Design Choices

### Why Not a Database?
- Adds a runtime dependency, violating the "lightweight" principle
- Not diffable in git
- Overkill for the amount of data (typically < 50 files, < 200KB total)

### Why Not JSON/YAML for Knowledge?
- Less readable for humans
- Harder for agents to write well-formatted content
- Markdown supports both structured (tables, lists) and unstructured (prose) content

### Why YAML Frontmatter?
- Separates metadata from content without a separate file
- Parseable by tools if we add a CLI later
- Familiar convention (Jekyll, Hugo, Docusaurus, MDX)

### Why Not a Plugin?
- Plugins are platform-specific (Claude Code vs Cursor vs Codex)
- CLAUDE.md + .ai/ convention works across any agent that reads project files
- No installation needed — just file conventions

## Future Considerations

- Optional CLI tool (Python or Node.js) for: `init`, `validate`, `stats`
- Potential MCP server for richer agent integration
- Multi-platform adapter layer (Cursor rules, Codex agents, Gemini)

## Changelog

### 2026-03-15
- Initial tech stack documentation
