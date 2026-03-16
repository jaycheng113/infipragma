---
name: Core Layer Init Guide
description: Template and guide for creating core/ documents during bootstrap
---

# Bootstrapping the Core Layer

When initializing .ai/ for an existing project, populate these core documents:

## architecture.md
1. System Overview: What does this system do?
2. Module Map: List all top-level modules with responsibilities
3. Data Flow: How does data move through the primary use case?
4. Key Patterns: What patterns does the codebase follow?

## principles.md
Extract from README, code review comments, repeated patterns in code.

## tech-stack.md
Auto-detect from package.json, pyproject.toml, go.mod, Cargo.toml, etc.
For each dependency: name, version, purpose, rationale.
