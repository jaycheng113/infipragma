# task-manager

A task management API with user authentication, built with FastAPI and PostgreSQL.

## Knowledge Base (.ai/)

| Document | Description |
|----------|-------------|
| .ai/core/architecture.md | Layered architecture: Router → Service → Repository → DB |
| .ai/features/auth.md | JWT auth, token refresh, RBAC with role hierarchy |
| .ai/features/tasks.md | Task CRUD, status workflow, assignment logic |
| .ai/evolution/history.md | ADRs and milestone log |
| .ai/evolution/tech-debt.md | Known issues: N+1 queries in task listing, sync email sending |

## Loading Protocol

1. This file is auto-loaded
2. Read `.ai/_loading-rules.md` and follow the decision tree

## Maintenance Protocol

After completing significant work, follow `.ai/_maintenance-rules.md`.

## Rules

1. All endpoints return RFC 7807 problem details on error
2. Database access only through repository layer — never raw SQL in services
3. Every new endpoint needs an OpenAPI example
4. Commit message format: `type(scope): description`

## Quick Reference

- Dev server: `uv run uvicorn app.main:app --reload`
- Test: `uv run pytest`
- Migrations: `uv run alembic upgrade head`
- Lint: `uv run ruff check src/`
