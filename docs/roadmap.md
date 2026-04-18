# Roadmap

## Fase 1 - Base Operacional

Status: concluida

- Monorepo estruturado com backend e frontend.
- Login local com JWT.
- Layout protegido no frontend.
- Módulos principais com dados de demonstração.
- Build local e smoke test documentados.

## Fase 2 - Persistencia Real

Status: planejada

- Conectar os serviços à base Prisma existente.
- Substituir os dados em memória por consultas reais no banco.
- Criar migrations para usuários, ativos, incidentes, tickets, checklists, SLA, auditoria e status.
- Revisar seed de ambiente com perfis e dados iniciais controlados.

## Fase 3 - Endurecimento De Seguranca

Status: planejada

- Atualizar a stack Nest para major mais recente compatível.
- Eliminar vulnerabilidades remanescentes de dependências.
- Revisar política de tokens, expiração e revogação.
- Migrar auditoria para persistência estável.

## Fase 4 - Observabilidade E Operacao

Status: planejada

- Adicionar logs estruturados.
- Integrar métricas e alertas para saúde da aplicação.
- Expandir o healthcheck com dependências externas.
- Registrar trilha de auditoria consultável no painel.

## Fase 5 - Produto Pronto Para Campo

Status: planejada

- Melhorar UX de mobile e tablets.
- Consolidar fluxos de abertura e tratamento de incidentes.
- Evoluir relatórios exportáveis e dashboards executivos.
- Adicionar evidências de uso real, telas e materiais de onboarding.

## Critérios De Evolucao

Cada fase só avança quando os itens abaixo estiverem validados:

1. Build local sem falhas.
2. Testes locais documentados.
3. Contratos de API preservados ou atualizados na documentação.
4. Evidências registradas no README.
5. Mudanças relevantes refletidas em docs de arquitetura e decisões técnicas.
