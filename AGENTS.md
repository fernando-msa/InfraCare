# AGENTS - InfraCare

## Índice rápido
- Visão geral: `docs/visao-geral.md`
- Requisitos: `docs/requisitos.md`
- Arquitetura: `docs/arquitetura.md`
- Modelo de dados: `docs/modelo-de-dados.md`
- Regras de negócio: `docs/regras-de-negocio.md`
- API: `docs/api.md`

## Como rodar
Siga o `README.md` (migrate + seed + dev).

## Onde estão os módulos
- Backend módulos em `backend/src/*`
- Frontend telas em `frontend/src/app/(protected)/*`

## Convenções
- TypeScript estrito
- Organização modular no backend
- Componentes reutilizáveis no frontend
- Atualize docs ao alterar contratos de API ou regras de negócio

## Testes
- Backend: `npm run test -w backend`
- Frontend: `npm run test -w frontend`

## Não quebrar sem atualizar documentação
- Modelo Prisma
- Contratos de autenticação JWT
- Regras de SLA e auditoria
