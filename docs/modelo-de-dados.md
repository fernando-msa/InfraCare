# Modelo De Dados

## Visao Geral

O esquema de dados do InfraCare foi desenhado para cobrir operação hospitalar, com foco em unidades, setores, usuários, ativos, incidentes, tickets, checklists, SLA, auditoria e status de serviços.

No runtime atual, os dados usados pela aplicação estão em memória para acelerar a validação local. O schema Prisma já está preparado para a migração futura para PostgreSQL.

## Entidades Principais

### Role

- Define o papel funcional do usuario.
- Valores atuais: `ADMIN`, `ANALYST`, `TECHNICIAN`, `MANAGER`.

### Unit

- Representa uma unidade hospitalar ou administrativa.
- Agrupa usuarios, setores, ativos, incidentes, checklists e tickets.

### Sector

- Pertence a uma `Unit`.
- Organiza recursos operacionais por area.

### User

- Contém nome, e-mail, hash de senha, status e papel.
- Pode pertencer a uma unidade.
- Serve como responsável por incidentes, checklists, tickets e auditoria.

### Asset

- Representa um ativo monitorado.
- Possui status atual, criticidade, método de monitoramento e intervalos de checagem.
- Relaciona-se com unidade e setor.

### AssetStatusHistory

- Registra mudanças de status do ativo ao longo do tempo.

### Incident

- Registra incidentes operacionais.
- Pode estar vinculado a um ativo, setor, unidade e responsável.
- Mantém status, severidade, causa raiz, ação corretiva e timeline.

### IncidentTimeline

- Registra a evolução temporal de um incidente.

### ChecklistTemplate

- Modelo-base de checklist.
- Define periodicidade e itens padrão.

### ChecklistTemplateItem

- Item pertencente a um template.
- Pode ser marcado como crítico.

### ChecklistExecution

- Execução de um checklist em uma unidade e setor específicos.
- Contém responsável, status, data de vencimento e observações.

### ChecklistExecutionItem

- Resultado de um item dentro de uma execução.
- Pode conter observação e evidência textual.

### Ticket

- Representa um chamado de suporte ou operação.
- Contém número, solicitante, prioridade, status e SLA estimado.
- Pode ser atribuído a um técnico.

### TicketTimeline

- Histórico de ações do ticket.

### SlaPolicy

- Define metas de resposta e resolução por prioridade.
- Pode ser associada a um setor.

### AuditLog

- Armazena eventos de auditoria por ação, entidade, descrição e IP.

### ServiceStatus

- Representa o status de um serviço ou sistema monitorado.
- Possui histórico em `ServiceStatusHistory`.

### ReportExport

- Registra exportações de relatórios geradas por usuários.

### Notification

- Base para notificações futuras.

## Relacionamentos Relevantes

- `Role 1:N User`
- `Unit 1:N Sector`
- `Unit 1:N User`
- `Unit 1:N Asset`
- `Unit 1:N Incident`
- `Unit 1:N ChecklistExecution`
- `Unit 1:N Ticket`
- `Sector 1:N Asset`
- `Sector 1:N Incident`
- `Sector 1:N ChecklistExecution`
- `Sector 1:N Ticket`
- `Asset 1:N AssetStatusHistory`
- `Asset 1:N Incident`
- `Incident 1:N IncidentTimeline`
- `ChecklistTemplate 1:N ChecklistTemplateItem`
- `ChecklistTemplate 1:N ChecklistExecution`
- `ChecklistExecution 1:N ChecklistExecutionItem`
- `Ticket 1:N TicketTimeline`
- `User 1:N Incident` como responsável
- `User 1:N ChecklistExecution` como responsável
- `User 1:N Ticket` como técnico
- `User 1:N AuditLog`

## Enumeracoes

### Status De Usuario

- `ACTIVE`
- `INACTIVE`

### Status De Ativo

- `ONLINE`
- `OFFLINE`
- `UNSTABLE`
- `MAINTENANCE`

### Criticidade

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

### Status De Incidente

- `OPEN`
- `ANALYSIS`
- `IN_PROGRESS`
- `RESOLVED`
- `CLOSED`

### Severidade

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

### Periodicidade De Checklist

- `DAILY`
- `WEEKLY`
- `BIWEEKLY`
- `MONTHLY`

### Status De Execucao De Checklist

- `PENDING`
- `IN_PROGRESS`
- `COMPLETED`
- `OVERDUE`

### Resultado De Item

- `COMPLIANT`
- `NON_COMPLIANT`
- `NOT_APPLICABLE`

### Status De Ticket

- `OPEN`
- `IN_PROGRESS`
- `WAITING_USER`
- `ESCALATED`
- `RESOLVED`
- `CLOSED`

### Prioridade

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

## Observacoes De Produto

1. O schema atual já contempla a maioria dos fluxos operacionais previstos.
2. O runtime da aplicação usa dados em memória, então parte das entidades ainda está documentada antes de ser persistida de fato.
3. A migração para banco real deve manter os mesmos conceitos e relações para evitar ruptura de contrato.

## Evolucao Recomendada

- Adicionar migrations formais para cada módulo persistido.
- Definir índices para campos de busca frequente, como e-mail, número de ticket e timestamps.
- Normalizar exportações e notificações quando entrarem em produção.
- Criar seed controlado para garantir consistência dos dados iniciais.
