# Decisoes Tecnicas

## Objetivo

Registrar as escolhas que sustentam a versão atual do InfraCare, para manter consistência entre implementação, documentação e evolução futura.

## Decisoes De Plataforma

### Monorepo Com Workspaces

- O projeto usa um monorepo com `backend` e `frontend` para simplificar execução local, build e testes.
- O script raiz orquestra os dois workspaces sem exigir tooling extra.

### Backend Em NestJS

- O backend permanece em NestJS por causa da estrutura modular, suporte nativo a guards, interceptors e validação.
- Os módulos de domínio seguem separação por responsabilidade para facilitar migração futura para persistência real.

### Frontend Em Next.js

- O frontend usa Next.js porque atende bem a páginas protegidas, rotas por módulo e build de produção com boa ergonomia.
- O layout protegido e o shell visual centralizam navegação, identidade e redirecionamento de sessão.

## Decisoes De Seguranca

### JWT Obrigatorio

- Removido qualquer fallback inseguro para o segredo JWT.
- A aplicação falha no bootstrap se `JWT_SECRET` não estiver definido.

### CORS Controlado Por Ambiente

- O backend aceita origens somente via `CORS_ORIGIN`.
- Isso evita liberar a API de forma ampla por engano em ambientes compartilhados.

### Sessao No Frontend

- O token é armazenado localmente apenas para a versão atual de demonstração.
- O layout protegido valida a presença do token e redireciona para login quando necessário.

### Auditoria

- O interceptor de auditoria registra ações relevantes sem bloquear a resposta da API.
- O armazenamento em memória foi escolhido para manter o bootstrap local simples nesta fase.

## Decisoes De Dados

### Dados De Demonstração Em Memoria

- Os módulos consultam um dataset local compartilhado em vez de banco real.
- Isso reduz a fricção para validar telas, login e navegação sem infraestrutura adicional.

### Prisma Como Contrato Futuro

- O schema Prisma já está mantido no repositório como base para a próxima etapa.
- A migração para banco real deve acontecer depois de estabilizar contratos de API e seed.

## Decisoes De UX

### Shell Unificado

- A navegação lateral e o frame visual ficam concentrados em um único componente.
- Isso reduz duplicação e mantém consistência entre módulos.

### Componente Generico De Módulo

- A maioria das telas usa o mesmo componente base para tabela, métricas e carregamento.
- A padronização facilita adicionar novos módulos sem refazer estrutura visual.

## Decisoes De Build E Ambiente

### OutputFileTracingRoot No Next

- O `outputFileTracingRoot` foi definido em [frontend/next.config.ts](../frontend/next.config.ts) para fixar o root do workspace.
- A decisão evita avisos e inferências incorretas quando existe lockfile acima da pasta do projeto.

### Tipagem Estrita

- Os `tsconfig.json` foram ajustados para manter consistência de caminhos e reduzir ruído de compilação.
- O backend e o frontend continuam em TypeScript estrito.

## Tradeoffs Aceitos

- O uso de dados em memória não representa produção real, mas foi aceito para acelerar validação local.
- A auditoria em memória também é transitória e deve ser substituída quando houver persistência estável.
- As vulnerabilidades restantes do ecossistema Nest 10 são conhecidas e exigem upgrade coordenado para uma major mais nova.

## Proximos Passos

1. Migrar serviços em memória para Prisma com migrations.
2. Revisar seed de usuários e dados base.
3. Planejar upgrade coordenado de Nest para reduzir vulnerabilidades de dependência.
4. Adicionar observabilidade real para logs e auditoria persistente.
