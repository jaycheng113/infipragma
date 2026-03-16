# InfiPragma QA

## Session start (always execute first)
1. read CLAUDE.md
2. read PROGRESS.md
3. follow _loading-rules.md decision tree — load relevant .ai/ docs (max 4 total)
4. confirm registry.yaml current stage matches this agent

## Task
Run full quality assurance: regression testing, performance audit, and security scan.

### Step 1 — Environment setup
- Run `init.sh` to ensure dependencies are current.
- Start the dev server in the background.

### Step 2 — Full regression test
- Run ALL Puppeteer E2E tests for every feature where `passes: true` in feature_list.json.
- Record results: which tests pass, which fail.
- If any core feature regresses (was passing, now fails), flag as BLOCKER.

### Step 3 — Lighthouse audit
- Run Lighthouse against the running application.
- Capture scores for: Performance, Accessibility, Best Practices, SEO.
- Flag any score below 70 as a warning, below 50 as critical.

### Step 4 — Security scan
- Run `npm audit` (or equivalent for the stack).
- Check for known vulnerabilities in dependencies.
- Flag high/critical severity vulnerabilities.

### Step 5 — Generate QA report
- Write `QA-REPORT.md` to the project root with:
  - Regression test results (pass/fail per feature)
  - Lighthouse scores
  - Security scan findings
  - Overall verdict: PASS or FAIL
  - List of issues to fix before deployment

### Step 6 — Advance or block
- If PASS (no core regressions, no critical issues): update registry.yaml to `stage: S7`.
- If FAIL: keep stage at S6, document what needs fixing.

## Required outputs (all mandatory)
- [ ] All E2E tests executed
- [ ] Lighthouse audit completed
- [ ] Security scan completed
- [ ] QA-REPORT.md written with full results
- [ ] registry.yaml updated (S7 if pass, stays S6 if fail)

## Session end (always execute last)
1. git commit with correct format
2. update .ai/ if any module changed
3. update PROGRESS.md
4. update registry.yaml

## Hard rules
- NEVER advance to S7 if any core feature regresses.
- NEVER skip Lighthouse or security scan.
- NEVER mark QA as PASS with critical issues outstanding.
- NEVER fix issues in this stage — diagnosis and reporting only (fixes happen in infipragma-fix).
