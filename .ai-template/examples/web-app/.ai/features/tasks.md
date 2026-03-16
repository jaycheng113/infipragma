---
name: Task Management
description: "Task CRUD with status workflow and assignment logic"
layer: feature
last_updated: 2026-03-15
---

# Task Management Module

## Responsibility

Core task operations: create, read, update, delete, assign, and status transitions. Does NOT handle notifications — emits events that the notification service consumes.

## Interface

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /tasks | GET | List tasks (filterable by status, assignee) |
| /tasks | POST | Create a new task |
| /tasks/{id} | GET | Get task details |
| /tasks/{id} | PATCH | Update task fields |
| /tasks/{id} | DELETE | Soft-delete a task |
| /tasks/{id}/assign | POST | Assign task to user |
| /tasks/{id}/transition | POST | Change task status |

## Internal Design

### Status State Machine
```
draft → open → in_progress → review → done
                    ↓                    ↓
                 blocked              closed
```

- Only valid transitions are allowed (enforced in service layer)
- Each transition emits a `task.status_changed` event

### Assignment Rules
- Tasks can have one assignee
- Only managers+ can reassign others' tasks
- Assignment emits `task.assigned` event

## Source Files

- `src/tasks/router.py` — FastAPI endpoints
- `src/tasks/service.py` — Business logic and state machine
- `src/tasks/repository.py` — Task queries with filtering
- `src/tasks/models.py` — SQLAlchemy models
- `src/tasks/events.py` — Event emission

## Dependencies

- **Depends on**: auth (require_auth), common (base models)
- **Used by**: notifications (via events)

## Changelog

### 2026-03-15
- Initial documentation
