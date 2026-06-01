# Prontidão de Deploy (Online/Hospedado)

## Escopo da revisão
Revisão estática do monorepo (`backend`, `frontend`, `docker-compose.yml`, `README`, `vercel.json`) com foco em gaps para produção.

## Status geral
**Não está pronto para produção sem ajustes.** 5 de 9 itens D0/D1 concluídos. Ver seção de evidências para detalhes.

## O que falta implantar antes de subir online

### 1) Segurança e autenticação
- [x] **Remover segredos fracos por fallback** no backend. Implementado via `getRequiredEnv('JWT_SECRET')` em `backend/src/env.ts`. App falha no boot sem segredo.
- [x] **Restringir CORS** para domínios autorizados. CORS agora lê `CORS_ORIGIN` (separado por vírgula) em `backend/src/main.ts`.
- [x] **Evitar credenciais padrão na tela de login**. Campos iniciam vazios; credenciais aparecem apenas em caixa informativa abaixo do formulário.
- [ ] **Persistir sessão de refresh token com estratégia de produção** (store centralizado + revogação persistente). Hoje a revogação fica em memória e perde estado em restart/escala horizontal.

### 2) Configuração de ambiente e operação
- [x] **Adicionar e versionar `backend/.env.example`**. Arquivo existe em `backend/.env.example` com `JWT_SECRET`, `CORS_ORIGIN`, `PORT`, `DATABASE_URL`.
- [x] **Definir variáveis obrigatórias de produção**. `JWT_SECRET` é obrigatória (falha sem), demais opcionais com defaults.
- [ ] **Separar scripts de migração dev/prod**: usar `prisma migrate deploy` em produção (não `migrate dev`).

### 3) Observabilidade e confiabilidade
- [x] **Criar endpoint público de healthcheck/readiness**. `GET /health` implementado em `backend/src/app.controller.ts` (sem JWT, retorna `{ status, service, timestamp }`).
- [ ] **Adicionar logs estruturados + correlação** (request id) e sink externo.
- [ ] **Definir política de backup/restore do PostgreSQL** e rotina de verificação.

### 4) Pipeline de entrega
- [x] **Criar CI** com lint, testes e build para backend e frontend. GitHub Actions em `.github/workflows/ci.yml`.
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

### Resolvidos
- ~~Fallback inseguro de JWT~~ → Corrigido: `getRequiredEnv('JWT_SECRET')` em `backend/src/env.ts`.
- ~~CORS aberto~~ → Corrigido: `CORS_ORIGIN` lido de env em `backend/src/main.ts`.
- ~~Login com credenciais padrão~~ → Corrigido: campos iniciam vazios em `frontend/src/app/login/page.tsx`.
- ~~`.env.example` ausente~~ → Corrigido: `backend/.env.example` versionado.
- ~~Healthcheck ausente~~ → Corrigido: `GET /health` em `backend/src/app.controller.ts`.

### Pendentes
- Revogação de refresh token em memória: `backend/src/auth/auth.service.ts`.
- `migrate dev` como script padrão atual: `backend/package.json`.



## Plano de execução por prioridade

### D0 (bloqueadores de go-live) — executar antes de qualquer publicação
1. ~~**Segredos obrigatórios sem fallback**~~ :white_check_mark: Feito.
2. ~~**CORS restrito por ambiente**~~ :white_check_mark: Feito.
3. ~~**Variáveis de ambiente e contrato operacional**~~ :white_check_mark: Feito.
4. **Migração de banco para produção**
   - Adicionar script `prisma migrate deploy` e executar no processo de release.
   - Resultado esperado: deploy sem depender de `migrate dev`.
5. ~~**Frontend sem credenciais default**~~ :white_check_mark: Feito.

### D1 (estabilização para operação contínua) — executar logo após D0
1. ~~**Healthcheck/readiness endpoint público**~~ :white_check_mark: Feito. `/health` implementado (sem JWT). Próximo passo: adicionar validação de conectividade DB.
2. **Sessão e refresh token com persistência**
   - Trocar revogação em memória por store persistente (ex.: Redis/DB).
   - Cobrir cenário multi-réplica e restart.
3. ~~**CI mínima obrigatória**~~ :white_check_mark: Feito. GitHub Actions CI em `.github/workflows/ci.yml`.
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
