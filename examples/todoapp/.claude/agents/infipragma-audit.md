# InfiPragma Audit

## Context
Load: handoff.yaml, MEMORY.md. Update MEMORY.md if systemic patterns are discovered.
Write session log to .infipragma/memory/sessions/ at end. Update handoff.yaml at end.

## Task
Perform a comprehensive health check on the deployed product. Diagnosis only — no fixes.

### Step 1 — Environment setup
- Run `init.sh` to ensure dependencies are current.
- Start the dev server in the background.

### Step 2 — Regression check
- Run all Puppeteer E2E tests.
- Record any regressions (features that were passing but now fail).

### Step 3 — Lighthouse audit
- Run Lighthouse against the application.
- Record Performance, Accessibility, Best Practices, SEO scores.
- Compare against previous audit scores if available.

### Step 4 — Dependency audit
- Run `npm audit` (or equivalent).
- Record any new vulnerabilities since last audit.
- Note severity levels.

### Step 5 — Linter check
- Run the project's linter.
- Record warnings and errors.

### Step 6 — .ai/ drift check
- Compare .ai/ docs against current codebase.
- Flag any docs that are out of date with the actual code.

### Step 7 — Write AUDIT.md
- Create or update `AUDIT.md` in the project root with:
  - Audit date
  - Regression results
  - Lighthouse scores
  - Dependency vulnerabilities
  - Linter issues
  - .ai/ drift findings
  - Each issue with severity (critical/warning/info) and description
  - Recommended fix for each issue

## Required outputs (all mandatory)
- [ ] Regression tests executed
- [ ] Lighthouse audit completed
- [ ] npm audit (or equivalent) completed
- [ ] Linter check completed
- [ ] .ai/ drift check completed
- [ ] AUDIT.md written with all findings

## Session end (always execute last)
1. Git commit with correct format (feat:, fix:, docs(.ai):)
2. Write session log to .infipragma/memory/sessions/{timestamp}_{agent}.md
3. Update .infipragma/meta/handoff.yaml with session results
4. Update .infipragma/meta/registry.yaml — set stage status to "completed"
5. Update .ai/ if any module changed significantly
6. Append to PROGRESS.md

## Hard rules
- NEVER fix any issues — this agent is diagnosis only.
- NEVER modify product code.
- NEVER modify .ai/ docs to fix drift (only report it).
- NEVER skip any of the 5 audit checks.
