# InfraCare

Plataforma web de operação hospitalar para monitoramento de ativos, incidentes, tickets, checklists, SLA, auditoria, status de serviços e relatórios.

## Escopo Atual

- Backend com API NestJS autenticada por JWT e CORS restrito por ambiente.
- Frontend Next.js com login, layout protegido e módulos operacionais.
- Dados de demonstração em memória para execução local imediata.
- Testes locais de fumaça e build de produção para backend e frontend.

## Stack

- Backend: NestJS, Passport JWT, TypeScript.
- Frontend: Next.js 15, React 19, Tailwind.
- Dados locais: dataset de demonstração em [backend/src/shared/demo-data.ts](backend/src/shared/demo-data.ts).

## Estrutura

- API principal em [backend/src](backend/src).
- UI principal em [frontend/src](frontend/src).
- Modelo de dados em [backend/prisma/schema.prisma](backend/prisma/schema.prisma).

## Variáveis De Ambiente

### Backend

Crie um arquivo .env em backend com base em:

Arquivo de exemplo: [backend/.env.example](backend/.env.example)

Variáveis obrigatórias:

- JWT_SECRET
- CORS_ORIGIN

Variáveis opcionais:

- PORT
- DATABASE_URL

### Frontend

Crie um arquivo .env.local em frontend com base em:

Arquivo de exemplo: [frontend/.env.local.example](frontend/.env.local.example)

Variável usada:

- NEXT_PUBLIC_API_URL

## Como Rodar Localmente

1. Instalar dependências

Comando:

```bash
npm install
```

1. Subir backend e frontend juntos

Comando:

```bash
npm run dev
```

1. Acessar aplicação

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:3001>
- Healthcheck: <http://localhost:3001/health>

## Conta De Demonstração

Para login local:

- E-mail: <admin@infracare.local>
- Senha: Admin@123

Implementação do login em [frontend/src/app/login/page.tsx](frontend/src/app/login/page.tsx).

## Endpoints Principais

- POST /auth/login
- GET /auth/me
- GET /health
- GET /dashboard
- GET /assets
- GET /incidents
- GET /tickets
- GET /checklists/executions
- GET /sla/indicators
- GET /status-page
- GET /reports
- GET /audit/logs
- GET /users

## Hardening Aplicado

1. Segredo JWT obrigatório

- Removido fallback inseguro.
- Implementado em [backend/src/env.ts](backend/src/env.ts), [backend/src/auth/auth.module.ts](backend/src/auth/auth.module.ts) e [backend/src/auth/jwt.strategy.ts](backend/src/auth/jwt.strategy.ts).

1. CORS controlado por ambiente

- CORS agora usa CORS_ORIGIN e aceita múltiplas origens separadas por vírgula.
- Implementado em [backend/src/main.ts](backend/src/main.ts).

1. Healthcheck público de operação

- Endpoint de saúde criado em [backend/src/app.controller.ts](backend/src/app.controller.ts).

1. Proteção de rotas e sessão

- Guard de autenticação e de papéis aplicado nos controllers.
- Layout protegido no frontend em [frontend/src/app/(protected)/layout.tsx](frontend/src/app/(protected)/layout.tsx).

1. Segurança de dependências

- Migração de bcrypt para bcryptjs em [backend/package.json](backend/package.json), [backend/src/auth/auth.service.ts](backend/src/auth/auth.service.ts) e [backend/src/shared/demo-data.ts](backend/src/shared/demo-data.ts).
- Atualização de Next para 15.5.15 em [frontend/package.json](frontend/package.json).

## Evidências Locais

### Build Backend

Comando executado:

```bash
JWT_SECRET=test-secret-for-infracare CORS_ORIGIN=http://localhost:3000 npm run build -w backend
```

Resultado observado:

- Build concluído com sucesso via Nest build.

### Build Frontend

Comando executado:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001 npm run build -w frontend
```

Resultado observado:

- Compilação otimizada concluída.
- Geração de páginas estáticas concluída.

### Teste Frontend

Comando executado:

```bash
npm run test -w frontend
```

Resultado observado:

- Frontend smoke checks passed.

Arquivo do teste: [frontend/test/smoke.test.js](frontend/test/smoke.test.js).

### Auditoria De Dependências

Comando executado:

```bash
npm audit --omit=dev
```

Achados atuais:

- Vulnerabilidades remanescentes em cadeia Nest 10 (nestjs core/platform-express/schedule).
- Vulnerabilidades transientes associadas a tar.

Status de mitigação:

- Vulnerabilidades críticas de Next tratadas na configuração do projeto.
- Próximo passo para zerar totalmente o audit: upgrade coordenado de Nest para major compatível e revisão de breaking changes.

### Revalidação Pós-Correção

Comandos executados nesta rodada:

```bash
JWT_SECRET=test-secret-for-infracare CORS_ORIGIN=http://localhost:3000 npm run build -w backend
npm run test -w frontend
npm ls next -w frontend --depth=0
```

Resultados observados:

- Build do backend executado com sucesso.
- Smoke test do frontend executado com sucesso.
- Next.js confirmado em `15.5.15` no workspace frontend.
- Build do frontend reexecutado após ajuste de configuração, sem reaparecer o aviso de root por lockfile externo.

Mitigação aplicada:

- Definido `outputFileTracingRoot` em [frontend/next.config.ts](frontend/next.config.ts) para fixar o root do projeto no workspace.

## Roteiro De Prints

Para registrar evidências visuais na entrega final, capture os seguintes pontos:

1. Tela de login: [frontend/src/app/login/page.tsx](frontend/src/app/login/page.tsx)
2. Dashboard: [frontend/src/app/(protected)/dashboard/page.tsx](frontend/src/app/(protected)/dashboard/page.tsx)
3. Incidentes: [frontend/src/app/(protected)/incidents/page.tsx](frontend/src/app/(protected)/incidents/page.tsx)
4. SLA: [frontend/src/app/(protected)/sla/page.tsx](frontend/src/app/(protected)/sla/page.tsx)
5. Auditoria: [frontend/src/app/(protected)/audit/page.tsx](frontend/src/app/(protected)/audit/page.tsx)

Sugestão de pasta para anexos finais: docs/evidencias.

## Observações Técnicas

- A camada de domínio está em modo demonstração com dados locais em memória.
- Para produção com persistência real, usar Prisma com migrations e seed revisada.
- A integração com banco está preparada pelo schema em [backend/prisma/schema.prisma](backend/prisma/schema.prisma), mas o runtime atual está otimizado para bootstrap local rápido.
