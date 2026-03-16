---
name: Development History
description: Architecture decisions and milestone log for task-manager
layer: evolution
last_updated: 2026-03-15
---

# Development History

## Architecture Decision Records

### ADR-001: Layered Architecture (2026-03-15)

**Context**: Need a clear structure for a growing API with multiple modules.

**Decision**: Four-layer architecture: Router → Service → Repository → DB.

**Consequences**: Clear separation of concerns, but requires discipline to not bypass layers.

### ADR-002: JWT + Redis for Auth (2026-03-15)

**Context**: Need stateless auth for horizontal scaling, but also need token revocation.

**Decision**: Short-lived JWTs (15min) + refresh tokens stored in Redis.

**Consequences**: Stateless request auth, but Redis dependency for token management.

## Milestone Log

### 2026-03-15: Initial Setup
- Project structure established
- Auth module implemented
- Task CRUD with status workflow
