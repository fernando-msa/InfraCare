<p align="center">
  <h1 align="center">InfraCare</h1>
  <p align="center">Hospital infrastructure operations platform for asset monitoring, incident management, SLA tracking, and audit compliance.</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## Overview

InfraCare is a full-stack web platform designed for hospital IT and NOC teams to manage infrastructure assets, operational incidents, support tickets, maintenance checklists, SLA compliance, service health status, audit logs, and report exports. The application features role-based access control (RBAC) with four distinct roles and a complete audit trail of all mutations.

> **Note:** This project is currently in **Phase 1 (operational prototype)** with an in-memory demo dataset. The Prisma schema is fully designed for PostgreSQL persistence, and the migration path is documented in the [roadmap](docs/roadmap.md).

## Architecture

```
infracare/
├── backend/          NestJS 10 API (REST, JWT auth, RBAC, audit interceptor)
│   ├── prisma/       Schema, migrations, seed script
│   └── src/          11 feature modules (auth, assets, incidents, tickets, checklists, SLA, status, dashboard, reports, audit, users)
├── frontend/         Next.js 15 App Router (React 19, Tailwind CSS)
│   └── src/          10 protected pages + reusable components (Shell, ModulePage, CrudPage)
└── docker-compose.yml  PostgreSQL 16 + backend + frontend
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| **NestJS modular backend** | Clear separation of concerns per domain (assets, incidents, tickets, etc.) with guards and interceptors as cross-cutting concerns |
| **Next.js App Router** | File-based routing with route groups for auth-protected pages, server components by default |
| **JWT + Passport** | Stateless authentication with role claims embedded in the token payload |
| **Prisma ORM** | Type-safe database access with declarative schema; currently defined but runtime uses in-memory demo data |
| **Global audit interceptor** | All POST/PATCH/PUT/DELETE requests are automatically logged with user context |
| **Monorepo with npm workspaces** | Single `npm install` / `npm run dev` for the full stack |

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | NestJS 10, TypeScript 5, Passport JWT, class-validator, bcryptjs |
| **Frontend** | Next.js 15, React 19, Tailwind CSS 3, TypeScript 5 |
| **Database** | PostgreSQL 16 (via Prisma 5 schema) |
| **Infrastructure** | Docker Compose, GitHub Actions CI, Vercel (frontend) |
| **Testing** | Jest + Supertest (backend), Node smoke tests (frontend) |

## Features

- **Authentication** -- JWT-based login with bcrypt password hashing; mandatory secret (no insecure fallback)
- **Role-Based Access Control** -- Four roles: ADMIN, ANALYST, TECHNICIAN, MANAGER with per-endpoint enforcement
- **Asset Management** -- Track hospital infrastructure assets with status history and criticality levels
- **Incident Tracking** -- Log and manage operational incidents with severity, timeline, and status workflow
- **Support Tickets** -- Ticket lifecycle with SLA deadlines, priority levels, and timeline events
- **Maintenance Checklists** -- Template-based periodic checklists with execution tracking and item-level results
- **SLA Monitoring** -- Compliance indicators by priority level with breach detection
- **Service Status Page** -- Real-time health status of hospital services with history
- **Audit Trail** -- Automatic logging of all mutations with user attribution and timestamp
- **Dashboard** -- Summary cards with aggregate counts and health indicators
- **Reports** -- Report export registry with module and period metadata
- **User Management** -- User listing with role and unit assignment (admin-only)

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 16 (optional -- runs with in-memory demo data by default)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/infracare.git
cd infracare

# Install all dependencies (monorepo)
npm install

# Start backend and frontend concurrently
npm run dev
```

The application will be available at:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Health Check | http://localhost:3001/health |

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@infracare.local | Admin@123 |
| Analyst | analyst@infracare.local | Analyst@123 |
| Technician | tech@infracare.local | Tech@123 |
| Manager | manager@infracare.local | Manager@123 |

### Environment Variables

**Backend** -- copy `backend/.env.example` to `backend/.env`:

```env
JWT_SECRET=your-secret-here          # Required
CORS_ORIGIN=http://localhost:3000    # Comma-separated origins
PORT=3001                            # Optional, default 3001
DATABASE_URL=postgresql://...        # Optional, for Prisma persistence
```

**Frontend** -- copy `frontend/.env.local.example` to `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Docker Compose (Full Stack with PostgreSQL)

```bash
docker-compose up --build
```

This starts PostgreSQL 16, the backend (port 3001), and the frontend (port 3000) with all services networked together.

## API Endpoints

| Method | Path | Auth | Roles |
|---|---|---|---|
| `POST` | `/auth/login` | No | -- |
| `GET` | `/auth/me` | Yes | All |
| `GET` | `/health` | No | -- |
| `GET` | `/dashboard` | Yes | All |
| `GET` | `/assets` | Yes | All |
| `GET` | `/incidents` | Yes | All |
| `GET` | `/tickets` | Yes | All |
| `GET` | `/checklists/executions` | Yes | All |
| `GET` | `/sla/indicators` | Yes | ADMIN, ANALYST, MANAGER |
| `GET` | `/status-page` | Yes | All |
| `GET` | `/reports` | Yes | ADMIN, ANALYST, MANAGER |
| `GET` | `/audit/logs` | Yes | ADMIN, ANALYST |
| `GET` | `/users` | Yes | ADMIN, ANALYST, MANAGER |

Full API documentation with request/response examples: [docs/api.md](docs/api.md)

## Project Documentation

| Document | Description |
|---|---|
| [docs/visao-geral.md](docs/visao-geral.md) | Project vision and target audience |
| [docs/requisitos.md](docs/requisitos.md) | Functional (RF01-RF12) and non-functional (RNF01-RNF05) requirements |
| [docs/arquitetura.md](docs/arquitetura.md) | Architecture overview and execution flow |
| [docs/modelo-de-dados.md](docs/modelo-de-dados.md) | Data model with 18 entities and 11 enums |
| [docs/regras-de-negocio.md](docs/regras-de-negocio.md) | Business rules per module |
| [docs/api.md](docs/api.md) | Full API reference |
| [docs/decisoes-tecnicas.md](docs/decisoes-tecnicas.md) | Technical decision log with rationale |
| [docs/deploy-readiness.md](docs/deploy-readiness.md) | Production readiness checklist |
| [docs/roadmap.md](docs/roadmap.md) | 5-phase evolution roadmap |

## Security Hardening Applied

1. **JWT secret required** -- `getRequiredEnv()` throws on missing secret; no insecure fallback
2. **CORS environment-controlled** -- Origins read from `CORS_ORIGIN` env var, comma-separated
3. **Global ValidationPipe** -- `whitelist: true`, `forbidUnknownValues: true`, implicit conversion enabled
4. **Route guards** -- JWT authentication guard + role-based access guard applied globally
5. **Password hashing** -- bcryptjs with salt rounds (migrated from native bcrypt for cross-platform support)
6. **Input sanitization** -- DTOs with class-validator decorators; mass-assignment protection via whitelist
7. **Audit interceptor** -- All mutations automatically logged with user, endpoint, and timestamp
8. **Public healthcheck** -- `/health` endpoint for orchestrator/monitoring integration without auth

## Testing

```bash
# Backend tests (Jest + Supertest)
npm run test -w backend

# Frontend smoke tests
npm run test -w frontend

# Lint both workspaces
npm run lint
```

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push to `main` and pull requests:

```
Install -> Lint -> Test -> Build
```

Frontend is configured for Vercel deployment via `vercel.json`.

## Roadmap

| Phase | Status | Focus |
|---|---|---|
| Phase 1 -- Base Operational | Done | Modular API, JWT auth, RBAC, demo data, 10 frontend pages |
| Phase 2 -- Real Persistence | Next | Prisma integration, migrations, seed scripts, pagination |
| Phase 3 -- Security Hardening | Planned | Rate limiting, token refresh, HTTPS, password policy |
| Phase 4 -- Observability | Planned | Structured logging, metrics, health probes, backups |
| Phase 5 -- Field-Ready | Planned | E2E tests, CI/CD pipeline, monitoring dashboards |

## License

MIT -- see [LICENSE](LICENSE) for details.

---

Built by [Fernando S. De Santana Junior](https://github.com/your-username)
