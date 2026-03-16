---
name: Authentication
description: "JWT auth with refresh tokens, RBAC with role hierarchy"
layer: feature
last_updated: 2026-03-15
---

# Authentication Module

## Responsibility

Handles user authentication (login, logout, token refresh) and authorization (role-based access control). Does NOT handle user profile management — that's in the users module.

## Interface

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /auth/login | POST | Exchange credentials for JWT + refresh token |
| /auth/refresh | POST | Exchange refresh token for new JWT |
| /auth/logout | POST | Invalidate refresh token |

### Middleware
- `require_auth` — validates JWT, injects `current_user` into request state
- `require_role(role)` — checks user has required role

## Internal Design

### Token Flow
1. Login → verify password → issue JWT (15min) + refresh token (7d, stored in Redis)
2. On 401 → client sends refresh token → verify in Redis → issue new JWT
3. Logout → delete refresh token from Redis

### Role Hierarchy
```
admin > manager > member > viewer
```
Higher roles inherit all permissions of lower roles.

## Source Files

- `src/auth/router.py` — FastAPI endpoints
- `src/auth/service.py` — Auth business logic
- `src/auth/repository.py` — User lookup queries
- `src/auth/dependencies.py` — require_auth, require_role
- `src/auth/tokens.py` — JWT creation and validation

## Dependencies

- **Depends on**: common (base models, DB session)
- **Used by**: tasks (require_auth middleware), notifications (user lookup)

## Changelog

### 2026-03-15
- Initial documentation
