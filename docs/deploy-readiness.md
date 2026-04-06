# Prontidão de Deploy (Online/Hospedado)

## Escopo da revisão
Revisão estática do monorepo (`backend`, `frontend`, `docker-compose`, `README`, `vercel.json`) com foco em gaps para produção.

## Status geral
**Não está pronto para produção sem ajustes.**

## O que falta implantar antes de subir online

### 1) Segurança e autenticação
- [ ] **Remover segredos fracos por fallback** no backend (`JWT_SECRET || 'dev-secret'`). Em produção, o serviço deve falhar no boot sem segredo explícito.
- [ ] **Restringir CORS** para domínios autorizados. Hoje está liberado globalmente.
- [ ] **Evitar credenciais padrão na tela de login** (email/senha seed pré-preenchidos).
- [ ] **Persistir sessão de refresh token com estratégia de produção** (store centralizado + revogação persistente). Hoje a revogação fica em memória (`Set`) e perde estado em restart/escala horizontal.

### 2) Configuração de ambiente e operação
- [ ] **Adicionar e versionar `backend/.env.example`** (referenciado no README, mas ausente no repositório).
- [ ] **Definir variáveis obrigatórias de produção**: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `PORT`, `NEXT_PUBLIC_API_URL`.
- [ ] **Separar scripts de migração dev/prod**: usar `prisma migrate deploy` em produção (não `migrate dev`).

### 3) Observabilidade e confiabilidade
- [ ] **Criar endpoint público de healthcheck/readiness** (ex.: `/health`) sem JWT, para orquestrador/monitoramento.
- [ ] **Adicionar logs estruturados + correlação** (request id) e sink externo.
- [ ] **Definir política de backup/restore do PostgreSQL** e rotina de verificação.

### 4) Pipeline de entrega
- [ ] **Criar CI** com lint, testes e build para backend e frontend.
- [ ] **Adicionar CD** (deploy automático com aprovação) e rollback documentado.
- [ ] **Executar migração Prisma no release** antes de trocar tráfego.

### 5) Infra de hospedagem
- [ ] **Escolher topologia oficial** (Vercel + API em container/VM ou full container em um provedor).
- [ ] **Configurar HTTPS, domínio e certificados** para frontend e API.
- [ ] **Provisionar banco gerenciado** com alta disponibilidade mínima e acesso privado.

## Checklist mínimo de Go-Live
1. Secrets e envs configurados no provedor (sem fallback inseguro).
2. Banco de produção provisionado + migração `deploy` aplicada.
3. Backend com CORS restrito e healthcheck operacional.
4. Frontend com `NEXT_PUBLIC_API_URL` apontando para API HTTPS.
5. CI passando (lint/test/build) em `main`.
6. Monitoramento, alertas e backup testado.

## Evidências no código (resumo)
- Fallback inseguro de JWT: `backend/src/auth/auth.module.ts`, `backend/src/auth/jwt.strategy.ts`.
- CORS aberto: `backend/src/main.ts`.
- Login com credenciais padrão: `frontend/src/app/login/page.tsx`.
- Revogação de refresh token em memória: `backend/src/auth/auth.service.ts`.
- `.env.example` mencionado, mas não versionado: `README.md`.
- `migrate dev` como script padrão atual: `backend/package.json`.



## Plano de execução por prioridade

### D0 (bloqueadores de go-live) — executar antes de qualquer publicação
1. **Segredos obrigatórios sem fallback**
   - Remover `|| 'dev-secret'` e falhar bootstrap se `JWT_SECRET` ausente.
   - Resultado esperado: app não sobe com configuração insegura.
2. **CORS restrito por ambiente**
   - Parametrizar `CORS_ORIGIN` e permitir apenas domínio(s) oficiais.
   - Resultado esperado: API aceita chamadas somente de origens autorizadas.
3. **Variáveis de ambiente e contrato operacional**
   - Criar `backend/.env.example` versionado e checklist de variáveis obrigatórias.
   - Publicar matriz de envs (`dev/staging/prod`) no provedor.
4. **Migração de banco para produção**
   - Adicionar script `prisma migrate deploy` e executar no processo de release.
   - Resultado esperado: deploy sem depender de `migrate dev`.
5. **Frontend sem credenciais default**
   - Remover valores seed pré-preenchidos da tela de login.
   - Resultado esperado: sem exposição de padrão operacional.

### D1 (estabilização para operação contínua) — executar logo após D0
1. **Healthcheck/readiness endpoint público**
   - Implementar `/health` (sem JWT) validando app + DB.
2. **Sessão e refresh token com persistência**
   - Trocar revogação em memória por store persistente (ex.: Redis/DB).
   - Cobrir cenário multi-réplica e restart.
3. **CI mínima obrigatória**
   - Pipeline com lint + test + build para backend/frontend em PR.
4. **Padronização de logs e auditoria operacional**
   - Logs estruturados com correlação (request id), retenção e consulta centralizada.
5. **Backup/restore do PostgreSQL**
   - Política de backup agendado + teste periódico de restauração.

### D2 (escala, governança e excelência operacional)
1. **CD com estratégia segura**
   - Deploy automatizado com aprovação e rollback documentado.
2. **Ambientes separados (staging/prod)**
   - Promoção por artefato imutável e validação pré-produção.
3. **Observabilidade avançada**
   - Alertas SLO/SLA, dashboards de latência/erros e tracing.
4. **Hardening adicional de segurança**
   - Rate limit, headers de segurança, rotação de segredos e revisão de permissões.
5. **Runbooks e resposta a incidentes**
   - Procedimentos de falha, indisponibilidade de banco, degradação e comunicação.

## Sequência sugerida (7-10 dias úteis)
- **Dia 1-2:** D0.1, D0.2, D0.3
- **Dia 3-4:** D0.4, D0.5 + validação de release candidate
- **Dia 5-6:** D1.1, D1.2
- **Dia 7-8:** D1.3, D1.4
- **Dia 9-10:** D1.5 + preparação de D2
