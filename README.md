# InfraCare

Plataforma web para monitoramento, operação e governança de infraestrutura hospitalar.

## Demo online
- https://infra-care.vercel.app/

## Stack
- Frontend: Next.js + TypeScript + Tailwind
- Backend: NestJS + TypeScript + Prisma
- Banco: PostgreSQL
- Auth: JWT + RBAC

## Como subir localmente
1. `npm install`
2. `cp backend/.env.example backend/.env`
3. `docker compose up -d postgres`
4. `npm run prisma:generate -w backend`
5. `npm run prisma:migrate -w backend`
6. `npm run prisma:seed -w backend`
7. `npm run dev`

Acesse:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

Credenciais seed (somente para desenvolvimento local):
- `admin@infracare.local`
- `Infracare@123`

> **Importante:** essas credenciais existem apenas para o ambiente local criado pelo seed. Não reutilize esses valores em homologação, produção ou qualquer deploy compartilhado. Em qualquer implantação, substitua imediatamente por credenciais/segredos próprios configurados via `.env`.
## Qualidade
- `npm run lint`
- `npm run test`

## Estrutura
- `/frontend` aplicação web
- `/backend` API e regras de negócio
- `/docs` documentação arquitetural e funcional
