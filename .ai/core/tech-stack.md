---
name: Technology Stack
description: "InfiPragma tech: pure markdown agents, YAML registry, Claude Code runtime"
layer: core
last_updated: 2026-03-15
---

# Technology Stack

## Core (InfiPragma itself)
| Technology | Purpose |
|-----------|---------|
| Markdown (.md) | Agent instructions, knowledge base, all documentation |
| YAML | Registry state, stack templates, config |
| JSON | Feature list |
| Claude Code | Runtime — reads and executes agent files |
| Git | Version control, product-level commits |

## Available Product Stacks
| Stack | Framework | Database | Deployment |
|-------|-----------|----------|------------|
| webapp | Next.js 14 + TypeScript | Supabase | Vercel |
| staticsite | Astro + TypeScript | None | Netlify |
| cli | Python + Click | None | PyPI |
| api | FastAPI + Python | PostgreSQL | Railway |
| desktop | Tauri 2 + React | None | GitHub Releases |
| bot | Discord.js + TypeScript | None | Railway |

## Design Choices
- No servers for InfiPragma itself — pure markdown + Claude Code
- Stack templates are declarative YAML — agents read and execute them
- Puppeteer for E2E testing across all web-based stacks
