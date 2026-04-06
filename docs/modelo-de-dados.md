# Modelo de Dados

Entidades principais no Prisma:
- User, Role, Unit, Sector
- Asset, AssetStatusHistory
- Incident, IncidentTimeline
- ChecklistTemplate, ChecklistExecution, ChecklistExecutionItem
- Ticket, TicketTimeline, SlaPolicy
- AuditLog
- ServiceStatus, ServiceStatusHistory

Relacionamentos atendem rastreabilidade por unidade, setor e responsável.
