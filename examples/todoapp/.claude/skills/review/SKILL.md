# /review — Trigger Immediate Audit

## Description
Runs an immediate audit of the product, regardless of schedule.

## Instructions

1. Read `.infipragma/meta/registry.yaml`
2. Verify phase is "maintenance" or "build" with S5+ completed
3. Update `registry.yaml`: set `maintenance.mode` to `"auditing"`
4. Execute the infipragma-audit agent:
   - Read `.claude/agents/infipragma-audit.md`
   - Follow its full protocol (session start → task → session end)
5. After audit completes, display the contents of `AUDIT.md`
6. Reset `maintenance.mode` to `"idle"` if no issues found, or leave as `"auditing"` if there are unresolved items

## Notes
- This can be run at any time after S4 (scaffold) is complete
- If run during build phase, it audits the current state of the product
- Does not fix anything — diagnosis only
