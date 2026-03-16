---
name: Architecture
description: "Layered architecture: Router → Service → Repository → DB, with background workers"
layer: core
last_updated: 2026-03-15
---

# Architecture

## System Diagram

```
                    ┌─────────────┐
                    │   Client    │
                    └──────┬──────┘
                           │ HTTP
                    ┌──────▼──────┐
                    │   FastAPI   │
                    │   Routers   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌──▼───┐ ┌──────▼──────┐
       │ Auth Service │ │Tasks │ │Notifications│
       │             │ │Service│ │  Service    │
       └──────┬──────┘ └──┬───┘ └──────┬──────┘
              │            │            │
       ┌──────▼──────┐ ┌──▼───┐ ┌──────▼──────┐
       │  Auth Repo  │ │Tasks │ │  Celery     │
       │             │ │ Repo │ │  Workers    │
       └──────┬──────┘ └──┬───┘ └──────┬──────┘
              │            │            │
       ┌──────▼────────────▼────────────▼──────┐
       │          PostgreSQL + Redis            │
       └───────────────────────────────────────┘
```

## Layer Rules

1. **Routers** → handle HTTP, validate input, call services. No business logic.
2. **Services** → business logic, orchestration. No direct DB access.
3. **Repositories** → database queries only. Return domain objects.
4. **Workers** → async background tasks. Called by services via message queue.

## Module Map

| Module | Path | Responsibility | Key Dependencies |
|--------|------|---------------|-----------------|
| auth | src/auth/ | Authentication, RBAC | JWT, bcrypt |
| tasks | src/tasks/ | Task CRUD, workflow | - |
| notifications | src/notifications/ | Email + in-app alerts | Celery, Redis |
| common | src/common/ | Shared utilities, base classes | SQLAlchemy |

## Key Patterns

- **Error handling**: All errors return RFC 7807 problem details
- **Auth**: JWT bearer tokens, refresh token rotation, role-based access
- **Database**: Async SQLAlchemy sessions, one session per request
- **Testing**: pytest with factory_boy fixtures, separate test database
