---
name: Core Layer Init Guide
description: Template and guide for creating core/ documents during bootstrap
---

# Bootstrapping the Core Layer

When initializing .ai/ for an existing project, populate these core documents:

## architecture.md

Analyze the project and fill in:
1. **System Overview**: What does this system do? (1 paragraph)
2. **Module Map**: List all top-level modules/packages with their responsibilities
   - Scan `src/`, `lib/`, `app/`, or equivalent directories
   - Each directory with its own purpose = one module
3. **Data Flow**: How does data move through the primary use case?
4. **Key Patterns**: What patterns does the codebase follow? (error handling, auth, DB access)

## principles.md

Extract from:
- README.md or CONTRIBUTING.md — often contains stated values
- Code review comments in git history — reveal implicit standards
- Repeated patterns in the code — indicate conventions
- If nothing explicit exists, infer 3-5 principles from the code structure

## tech-stack.md

Auto-detect from:
- `package.json` → Node.js dependencies
- `pyproject.toml` / `requirements.txt` → Python dependencies
- `go.mod` → Go dependencies
- `Cargo.toml` → Rust dependencies
- `Gemfile` → Ruby dependencies
- `pom.xml` / `build.gradle` → Java dependencies
- `Dockerfile` / `docker-compose.yml` → Infrastructure
- `.github/workflows/` → CI/CD tools

For each dependency, document: name, version, purpose, and why it was chosen (if discoverable).
