# Session Log: infipragma-build — 2026-03-16T17:05:00Z

## Feature Implemented
- **core-empty-state** (priority 8): Show a friendly message when no tasks exist

## What Was Done
- Confirmed scaffold already implements empty state (HTML element, CSS styles, JS render logic)
- Wrote Puppeteer E2E test covering: visibility with no tasks, friendly message content, hidden after add, reappears after delete
- E2E test: PASS
- Updated feature_list.json: passes=true for core-empty-state
- Updated PROGRESS.md
- .ai/ drift check: no changes needed (task-list module unchanged)

## Files Modified
- tests/core-empty-state.test.js (created)
- feature_list.json (passes field updated)
- PROGRESS.md (appended)

## Features Status
- Passing: 8/25
- Next: core-single-page-layout (priority 9)

## Errors Encountered
- None

---

# Session Log: infipragma-build — 2026-03-16T19:00:00Z

## Feature Implemented
- **enhanced-task-timestamps** (priority 18): Show creation date for each task

## What Was Done
- Added `createdAt` ISO 8601 field to task data model in `addTask()`
- Added `formatDate()` helper: relative time (just now, Xm/Xh/Xd ago) then absolute date
- Wrapped task text + timestamp in `.task-content` div; timestamp rendered as `<small class="task-timestamp">`
- Added CSS for `.task-content` (flex column) and `.task-timestamp` (small muted text)
- Backward-compatible: tasks without `createdAt` skip timestamp display
- Wrote Puppeteer E2E test covering: timestamp display, createdAt in localStorage, persistence, relative time, multiple tasks, older tasks
- E2E test: PASS
- Updated architecture.md data model with `createdAt` field

## Files Modified
- app.js (createdAt field, formatDate helper, task-content wrapper)
- style.css (.task-content, .task-timestamp styles)
- feature_list.json (passes=true for enhanced-task-timestamps)
- tests/enhanced-task-timestamps.test.js (created)
- PROGRESS.md (appended)
- .ai/core/architecture.md (data model updated)

## Features Status
- Passing: 18/25
- Next: enhanced-select-all-toggle (priority 19)

## Errors Encountered
- None
