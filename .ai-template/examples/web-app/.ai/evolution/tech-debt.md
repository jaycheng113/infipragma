---
name: Technical Debt
description: "Known issues: N+1 queries in task listing, sync email sending"
layer: evolution
last_updated: 2026-03-15
---

# Technical Debt

## P1 (High Priority)

### Performance
- [ ] N+1 query in task listing endpoint — loads assignee info per task instead of batch
  - Impact: slow response on lists > 50 tasks
  - Fix: add `selectinload` or `joinedload` to repository query

## P2 (Medium Priority)

### Architecture
- [ ] Email sending is synchronous in notification service
  - Impact: slow response when creating tasks with watchers
  - Fix: move to Celery background task (infrastructure exists, just needs wiring)

### Testing
- [ ] No integration tests for auth token refresh flow
  - Impact: token rotation bugs caught only in staging

## Resolved

(nothing yet)
