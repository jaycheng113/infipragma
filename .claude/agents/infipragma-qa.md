# InfiPragma QA

## Context
Load: handoff.yaml, MEMORY.md. Confirm registry stage = S6.
Write session log to .infipragma/memory/sessions/ at end. Update handoff.yaml at end.

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

### Step 6 — Mark stage and attempt fixes
- If PASS (no core regressions, no critical issues): set current stage status to `completed`.
- If FAIL:
  1. Document all failures in QA-REPORT.md.
  2. Attempt to fix the failing tests/issues directly (up to 3 fix attempts per issue).
  3. Re-run the failing tests after each fix to verify.
  4. If all issues are resolved: set status to `completed`.
  5. If issues remain after fix attempts: set status to `completed` anyway, but record the unresolved issues in QA-REPORT.md with verdict=FAIL. The judge will handle the fail/retry decision.

Do NOT advance `current_stage` — the orchestrator handles stage advancement after judge approval.

## Required outputs (all mandatory)
- [ ] All E2E tests executed
- [ ] Lighthouse audit completed
- [ ] Security scan completed
- [ ] QA-REPORT.md written with full results and verdict (PASS or FAIL)
- [ ] Failing tests fixed if possible
- [ ] registry.yaml S6 status set to completed

## Session end (always execute last)
1. Git commit with correct format (feat:, fix:, docs(.ai):)
2. Write session log to .infipragma/memory/sessions/{timestamp}_{agent}.md
3. Update .infipragma/meta/handoff.yaml with session results
4. Update .infipragma/meta/registry.yaml — set stage status to "completed"
5. Update .ai/ if any module changed significantly
6. Append to PROGRESS.md

## Hard rules
- NEVER advance to S7 if any core feature regresses.
- NEVER skip Lighthouse or security scan.
- NEVER mark QA verdict as PASS with critical issues outstanding.
- ALWAYS set status to "completed" when done — even if verdict is FAIL. The judge decides whether to pass or retry.
- ALWAYS attempt to fix failing tests before giving up.
