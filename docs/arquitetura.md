# Arquitetura

## Monorepo
- `/backend`: API NestJS + Prisma
- `/frontend`: App Next.js
- `/docs`: documentação

## Backend
- Módulos por domínio (assets, incidents, tickets, checklists etc.)
- PrismaService global
- Guard de RBAC e interceptor de auditoria

## Frontend
- Layout protegido com navegação lateral
- Páginas por módulo
- Componentes reutilizáveis (Shell, ModulePage, CrudPage)
