# InfraCare -- Audit Report

**Date:** 2026-05-31
**Scope:** Full codebase review -- security, code quality, test coverage, documentation consistency

---

## Executive Summary

InfraCare is a well-structured NestJS + Next.js monorepo for hospital infrastructure operations. The modular architecture is clean and follows framework conventions. However, the project is in prototype phase with critical gaps in persistence (all data is in-memory), test coverage (3 backend tests, 0 functional frontend tests), and several security issues that would block production deployment.

| Area | Rating | Key Finding |
|---|---|---|
| Architecture | Good | Clean modular NestJS + Next.js App Router with proper guard/interceptor patterns |
| Security | Needs Work | 4 high/critical issues (hardcoded creds in UI, JWT in localStorage, no rate limiting, no token revocation) |
| Test Coverage | Poor | 3 backend integration tests, file-existence-only frontend tests |
| Documentation | Good (with issues) | Comprehensive 9-doc set, but deploy-readiness.md is stale |
| Production Readiness | Not Ready | In-memory data, no pagination, no CRUD endpoints, no E2E tests |

---

## 1. Security Findings

### Critical

| # | Issue | Location | Description |
|---|---|---|---|
| S1 | Demo credentials in rendered HTML | `frontend/src/app/login/page.tsx:116-119` | Admin email/password displayed in the login page UI. Any deployed instance exposes valid credentials to every visitor. |
| S2 | Hardcoded credentials in source | `backend/src/shared/demo-data.ts:29-61`, `docker-compose.yml:10,21`, `backend/prisma/seed.ts:47` | Multiple hardcoded passwords and JWT secrets committed to git. |

### High

| # | Issue | Location | Description |
|---|---|---|---|
| S3 | JWT stored in localStorage | `frontend/src/app/login/page.tsx:39`, `layout.tsx:12`, `module-page.tsx:55`, `shell.tsx:24` | Accessible to any JavaScript (XSS-exploitable). Should use httpOnly cookies. |
| S4 | No brute-force protection | `backend/src/auth/auth.controller.ts` | No rate limiting, account lockout, or CAPTCHA on login endpoint. |
| S5 | No token revocation | `backend/src/auth/jwt.strategy.ts:16-18` | `validate()` trusts JWT payload without DB lookup. Deactivated users remain authenticated for 8h. |

### Medium

| # | Issue | Location | Description |
|---|---|---|---|
| S6 | Weak password policy | `backend/src/auth/auth.controller.ts:11` | `@MinLength(1)` accepts any non-empty string. |
| S7 | HTTP fallback in client bundle | `frontend/src/lib/api.ts:1`, `login/page.tsx:7`, `crud-page.tsx:16,34` | `http://localhost:3001` baked into production bundle if env var missing. |
| S8 | No CSRF protection on login | `frontend/src/app/login/page.tsx:28-31` | Login POST has no CSRF token. |
| S9 | Missing `@IsEnum` on DTOs | `incidents/dto/create-incident.dto.ts:7,13`, `tickets/dto/create-ticket.dto.ts:11,12`, `checklists/dto/complete-checklist.dto.ts:4` | Union-typed fields use `@IsString()` instead of `@IsEnum()`, accepting any string. |
| S10 | Audit logs request body | `backend/src/audit/audit.interceptor.ts:35` | Pattern could lead to sensitive data leakage if expanded. |

### Low

| # | Issue | Location | Description |
|---|---|---|---|
| S11 | No token refresh | `frontend/src/lib/api.ts` | Users silently kicked to login on expiry. |
| S12 | No server-side logout | `frontend/src/components/shell.tsx:23-26` | Token remains valid until expiry after client-side logout. |
| S13 | `bcrypt.hashSync` blocks event loop | `backend/src/shared/demo-data.ts:23` | 8 synchronous bcrypt hashes computed at startup. |
| S14 | Unnecessary JWT payload bloat | `backend/src/auth/auth.service.ts:22` | `name` field included in JWT payload. |
| S15 | Hardcoded test secret | `backend/src/app.spec.ts:4` | `'test-secret-for-infracare'` in test setup. |

---

## 2. Code Quality Findings

### Backend

| # | Severity | Issue | Location |
|---|---|---|---|
| C1 | High | All services read from in-memory array, not database | All `*.service.ts` files, `shared/demo-data.ts` |
| C2 | Medium | DTOs defined but no corresponding CRUD endpoints | `assets/dto/`, `incidents/dto/`, `tickets/dto/`, `checklists/dto/` |
| C3 | Medium | No pagination on any list endpoint | All controllers |
| C4 | Medium | PrismaModule is `@Global()` but never used | `prisma/prisma.module.ts` |
| C5 | Medium | Unused `@nestjs/schedule` dependency | `backend/package.json` |
| C6 | Medium | Redundant `bcryptjs.d.ts` type declaration | `backend/src/types/bcryptjs.d.ts` |
| C7 | Low | Inconsistent `cors: false` + `enableCors()` | `backend/src/main.ts:8` |
| C8 | Low | `PrismaService` missing `enableShutdownHooks` | `backend/src/prisma/prisma.service.ts` |
| C9 | Low | Mutable shared array for audit logs (not thread-safe) | `shared/demo-data.ts`, `audit/audit.service.ts` |

### Frontend

| # | Severity | Issue | Location |
|---|---|---|---|
| C10 | Medium | `any` type usage | `crud-page.tsx:8` |
| C11 | Medium | Duplicated API base URL in 3 files | `api.ts:1`, `login/page.tsx:7`, `crud-page.tsx:16,34` |
| C12 | Medium | `CrudPage` bypasses shared `api()` helper | `crud-page.tsx:12-45` |
| C13 | Medium | Missing ARIA landmarks/labels | `shell.tsx` |
| C14 | Medium | No loading skeleton/spinner | `module-page.tsx` |
| C15 | Medium | Blank screen during auth check | `(protected)/layout.tsx:20-22` |
| C16 | Low | Hard data truncation (12/20 rows, no pagination) | `module-page.tsx:133`, `crud-page.tsx:72` |
| C17 | Low | `CrudPage` component never imported (dead code) | `crud-page.tsx` |
| C18 | Low | Table lacks `<caption>` element | `module-page.tsx:123-155` |
| C19 | Low | No responsive hamburger menu | `shell.tsx:29-61` |
| C20 | Low | No logout confirmation dialog | `shell.tsx:23-26` |

### Prisma Schema

| # | Severity | Issue | Location |
|---|---|---|---|
| C21 | Medium | `Notification` model missing `userId` field | `schema.prisma:327-333` |
| C22 | Medium | `ReportExport.generatedBy` is `String`, not FK to `User` | `schema.prisma:319-325` |
| C23 | Medium | No indexes beyond `@unique` fields | `schema.prisma` |
| C24 | Low | `Asset.ip` has no format validation or unique constraint | `schema.prisma:139-140` |
| C25 | Low | `SlaPolicy` has no composite unique on `(priority, sectorId)` | `schema.prisma:287` |
| C26 | Low | No soft delete pattern for audit-compliant entities | `schema.prisma` |

### Docker / Infrastructure

| # | Severity | Issue | Location |
|---|---|---|---|
| C27 | High | Hardcoded DB password and JWT secret | `docker-compose.yml:10,21` |
| C28 | Medium | Dockerfile installs devDependencies in production | `backend/Dockerfile:4` |
| C29 | Medium | No `.dockerignore` file | Project root |
| C30 | Medium | PostgreSQL port exposed to host | `docker-compose.yml:12` |
| C31 | Low | No version pinning on base image | `backend/Dockerfile:1` |
| C32 | Low | Container runs as root | `backend/Dockerfile`, `frontend/Dockerfile` |

---

## 3. Test Coverage Assessment

### Backend (Jest + Supertest)

| Area | Tests | Status |
|---|---|---|
| Health check (`GET /health`) | 1 | Covered |
| Login success (`POST /auth/login`) | 1 | Covered |
| Login failure | 1 | Covered |
| All authenticated endpoints | 0 | Not tested |
| JWT guard behavior | 0 | Not tested |
| Role-based access control | 0 | Not tested |
| Audit interceptor | 0 | Not tested |
| Service unit tests | 0 | Not tested |
| Edge cases (expired token, malformed input) | 0 | Not tested |

### Frontend

| Area | Tests | Status |
|---|---|---|
| File existence checks | 6 assertions | Covered (smoke only) |
| Component rendering | 0 | Not tested |
| User interactions | 0 | Not tested |
| API integration | 0 | Not tested |
| Auth flow | 0 | Not tested |
| Utility functions | 0 | Not tested |
| Accessibility | 0 | Not tested |

**No test framework installed for frontend** (no Jest, Vitest, React Testing Library, Playwright, or Cypress).

---

## 4. Documentation Findings

### Stale: `docs/deploy-readiness.md`

5 items marked as "not done" are already implemented:

| Item | Status in Doc | Actual Status |
|---|---|---|
| JWT fallback removal | D0 blocker | Done -- uses `getRequiredEnv()` |
| CORS restriction | D0 blocker | Done -- reads from `CORS_ORIGIN` |
| Default credentials in login form | D0 blocker | Done -- fields initialize empty |
| `backend/.env.example` missing | D0 blocker | Done -- file exists |
| Healthcheck endpoint | D1 | Done -- `GET /health` implemented |

### Other Documentation Issues

| # | Issue |
|---|---|
| D1 | No timestamps or version numbers on any doc |
| D2 | API docs lack error response formats (401, 403, 400) |
| D3 | No visual diagrams (sequence, component) in architecture doc |
| D4 | Portuguese-only docs may limit external accessibility |
| D5 | Status enum mismatch between Prisma schema (`ONLINE/OFFLINE/UNSTABLE/MAINTENANCE`) and demo data (`OK/WARN/CRITICAL/INFO/BLOCKED`) not documented |

---

## 5. Priority Remediation Plan

### P0 -- Must Fix Before Any Deployment

1. Remove hardcoded credentials from `docker-compose.yml` (use env vars/secrets)
2. Remove demo credentials from login page UI (`login/page.tsx:116-119`)
3. Move JWT from localStorage to httpOnly cookie
4. Add rate limiting to `POST /auth/login`
5. Validate JWT against database in `JwtStrategy.validate()`

### P1 -- Should Fix Soon

6. Fix DTO validation -- replace `@IsString()` with `@IsEnum()` on union fields
7. Add `userId` to `Notification` model in Prisma schema
8. Make `ReportExport.generatedBy` a proper FK
9. Add database indexes on frequently queried fields
10. Update `deploy-readiness.md` to reflect current state
11. Centralize API base URL in frontend (single source in `lib/api.ts`)

### P2 -- Important for Production

12. Integrate Prisma into service layer (replace in-memory data)
13. Add pagination to all list endpoints
14. Implement missing CRUD endpoints for DTOs that already exist
15. Add meaningful backend tests for authenticated endpoints and RBAC
16. Install frontend test framework and add component/integration tests
17. Pin Docker base image versions, use multi-stage builds, run as non-root
18. Add `.dockerignore`

### P3 -- Nice to Have

19. Add loading skeletons to frontend
20. Add ARIA labels and accessibility improvements
21. Add responsive hamburger menu for mobile
22. Remove unused `@nestjs/schedule` dependency
23. Remove dead `CrudPage` component or wire it up
24. Add timestamps to documentation files
