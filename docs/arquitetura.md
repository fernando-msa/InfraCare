# Arquitetura

## Visao Geral

O InfraCare segue uma arquitetura monorepo com dois workspaces principais:

- `backend`: API NestJS com autenticação JWT, guards de papel e dados de demonstração em memória para execução local.
- `frontend`: aplicação Next.js com layout protegido, login local e páginas de módulos reutilizando o mesmo componente visual.

O objetivo atual é manter a base pronta para operação local, validação de fluxo e evolução posterior para persistência real com Prisma e banco PostgreSQL.

## Fluxo De Execucao

1. O usuario acessa a tela de login no frontend.
2. O frontend envia credenciais para `POST /auth/login`.
3. A API valida a conta de demonstração, emite JWT e retorna o perfil sanitizado.
4. O frontend salva o token e libera as rotas protegidas.
5. As telas de módulo consomem os endpoints da API com o token em `Authorization: Bearer ...`.

## Backend

### Estrutura Backend

- `src/main.ts`: bootstrap, CORS por ambiente e validação global.
- `src/app.module.ts`: composição dos módulos, guard global de papéis e interceptor de auditoria.
- `src/auth`: login, estratégia JWT e contrato de autenticação.
- `src/common`: guard de JWT e autorização por papéis.
- `src/shared/demo-data.ts`: dataset local usado para demonstração e testes locais.

### Decisoes Tecnicas

- O segredo JWT passou a ser obrigatório via ambiente.
- O CORS é limitado por `CORS_ORIGIN`.
- A auditoria é registrada em memória no modo atual para manter o bootstrap local simples.
- O healthcheck foi exposto em `GET /health` para verificacao operacional.

## Frontend

### Estrutura Frontend

- `src/app/login/page.tsx`: tela de autenticação.
- `src/app/(protected)/layout.tsx`: proteção de rota por token local.
- `src/components/shell.tsx`: navegação lateral e shell visual.
- `src/components/module-page.tsx`: componente genérico para módulos com tabela e métricas.
- `src/lib/api.ts`: wrapper de fetch com tratamento de erro padronizado.

### Decisoes Visuais

- O frontend usa uma identidade visual própria com painel escuro, cards translúcidos e tipografia expressiva.
- A mesma base de layout atende módulos diferentes para reduzir duplicação.

## Build E Tracing

O arquivo [frontend/next.config.ts](../frontend/next.config.ts) define `outputFileTracingRoot` para fixar o root do projeto no workspace do InfraCare. Isso evita que o Next tente inferir diretórios externos quando existe outro `package-lock.json` acima da pasta do repositório.

## Persistencia E Evolucao

O schema Prisma já existe em [backend/prisma/schema.prisma](../backend/prisma/schema.prisma), mas o runtime atual usa dados de demonstração em memória para acelerar validação local.

Para a próxima etapa de produto, o caminho natural é:

- migrar os serviços em memória para Prisma real;
- substituir os dados de demo por seed revisado;
- manter JWT, CORS e auditoria como contratos estáveis.
