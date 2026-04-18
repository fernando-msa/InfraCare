import bcrypt from 'bcryptjs';

export type RoleName = 'ADMIN' | 'ANALYST' | 'TECHNICIAN' | 'MANAGER';

export type StatusLabel = 'OK' | 'WARN' | 'CRITICAL' | 'INFO' | 'BLOCKED';

export type Row = {
  id: string;
  name: string;
  status: StatusLabel;
  summary: string;
  updatedAt: string;
  details?: string;
};

export type UserRow = Row & {
  email: string;
  role: RoleName;
  passwordHash: string;
  unit?: string;
};

const hash = (value: string) => bcrypt.hashSync(value, 10);

export const users: UserRow[] = [
  {
    id: 'usr-admin',
    name: 'Fernanda Lima',
    email: 'admin@infracare.local',
    role: 'ADMIN',
    passwordHash: hash('Admin@123'),
    unit: 'Matriz',
    status: 'OK',
    summary: 'Acesso administrativo completo',
    updatedAt: '2026-04-18T08:20:00.000Z',
  },
  {
    id: 'usr-analyst',
    name: 'Bruno Alves',
    email: 'analyst@infracare.local',
    role: 'ANALYST',
    passwordHash: hash('Analyst@123'),
    unit: 'NOC',
    status: 'OK',
    summary: 'Acompanhamento de indicadores',
    updatedAt: '2026-04-18T08:15:00.000Z',
  },
  {
    id: 'usr-tech',
    name: 'Carol Souza',
    email: 'tech@infracare.local',
    role: 'TECHNICIAN',
    passwordHash: hash('Tech@123'),
    unit: 'Field Services',
    status: 'WARN',
    summary: 'Fila de atendimento ativa',
    updatedAt: '2026-04-18T08:12:00.000Z',
  },
  {
    id: 'usr-manager',
    name: 'Diego Martins',
    email: 'manager@infracare.local',
    role: 'MANAGER',
    passwordHash: hash('Manager@123'),
    unit: 'Operações',
    status: 'OK',
    summary: 'Visão executiva de SLA e incidentes',
    updatedAt: '2026-04-18T08:05:00.000Z',
  },
];

export const assets: Row[] = [
  {
    id: 'ast-001',
    name: 'Servidor PACS',
    status: 'OK',
    summary: 'Disponível e monitorado a cada 5 minutos',
    updatedAt: '2026-04-18T08:10:00.000Z',
    details: '10.20.0.11 - Datacenter principal',
  },
  {
    id: 'ast-002',
    name: 'Firewall Perimetral',
    status: 'WARN',
    summary: 'Latência acima do esperado em janela curta',
    updatedAt: '2026-04-18T08:06:00.000Z',
    details: '10.20.0.2 - Cluster principal',
  },
  {
    id: 'ast-003',
    name: 'Servidor de E-mail',
    status: 'CRITICAL',
    summary: 'Fila SMTP parada desde 07:40',
    updatedAt: '2026-04-18T07:58:00.000Z',
    details: '10.20.0.32 - Serviço corporativo',
  },
];

export const incidents: Row[] = [
  {
    id: 'inc-001',
    name: 'Instabilidade no e-mail corporativo',
    status: 'CRITICAL',
    summary: 'Fluxo de mensagens interrompido para 17 setores',
    updatedAt: '2026-04-18T08:18:00.000Z',
    details: 'Origem: servidor de e-mail; responsável: Carol Souza',
  },
  {
    id: 'inc-002',
    name: 'Queda parcial no Wi-Fi da UTI',
    status: 'WARN',
    summary: 'Pacotes perdidos acima do limite por 12 minutos',
    updatedAt: '2026-04-18T07:52:00.000Z',
    details: 'Origem: controladora sem fio',
  },
  {
    id: 'inc-003',
    name: 'Fila de impressão estabilizada',
    status: 'OK',
    summary: 'Correção aplicada e monitoramento ativo',
    updatedAt: '2026-04-18T07:30:00.000Z',
    details: 'Sem impacto adicional',
  },
];

export const tickets: Row[] = [
  {
    id: 'tic-1001',
    name: 'Troca de toner setor administrativo',
    status: 'INFO',
    summary: 'Aberto pela recepção para SLA de 4h',
    updatedAt: '2026-04-18T08:13:00.000Z',
    details: 'Tecnologia: impressão',
  },
  {
    id: 'tic-1002',
    name: 'Falha de login no prontuário',
    status: 'WARN',
    summary: 'Usuário aguarda reset controlado',
    updatedAt: '2026-04-18T08:02:00.000Z',
    details: 'Prioridade alta',
  },
  {
    id: 'tic-1003',
    name: 'Novo acesso para auditoria',
    status: 'OK',
    summary: 'Perfil provisionado com sucesso',
    updatedAt: '2026-04-18T07:41:00.000Z',
    details: 'Autorização concluída',
  },
];

export const checklistExecutions: Row[] = [
  {
    id: 'chk-2001',
    name: 'Checklist diário UTI',
    status: 'WARN',
    summary: '2 itens não conformes, evidência anexada',
    updatedAt: '2026-04-18T08:00:00.000Z',
    details: 'Vistoria de turnos',
  },
  {
    id: 'chk-2002',
    name: 'Checklist semanal NOC',
    status: 'OK',
    summary: 'Execução concluída sem desvios',
    updatedAt: '2026-04-18T07:15:00.000Z',
    details: 'Conferência de serviços críticos',
  },
  {
    id: 'chk-2003',
    name: 'Checklist mensal backups',
    status: 'INFO',
    summary: 'Próxima execução agendada para quinta-feira',
    updatedAt: '2026-04-18T06:50:00.000Z',
    details: 'Controle de retenção',
  },
];

export const slaPolicies: Row[] = [
  {
    id: 'sla-01',
    name: 'Atendimento crítico',
    status: 'CRITICAL',
    summary: '1h primeira resposta, 4h resolução',
    updatedAt: '2026-04-18T08:19:00.000Z',
    details: 'Atingido 92% no mês',
  },
  {
    id: 'sla-02',
    name: 'Atendimento alto',
    status: 'WARN',
    summary: '2h primeira resposta, 8h resolução',
    updatedAt: '2026-04-18T08:17:00.000Z',
    details: 'Atingido 88% no mês',
  },
  {
    id: 'sla-03',
    name: 'Atendimento padrão',
    status: 'OK',
    summary: '4h primeira resposta, 24h resolução',
    updatedAt: '2026-04-18T08:16:00.000Z',
    details: 'Atingido 99% no mês',
  },
];

export const auditLogs: Row[] = [
  {
    id: 'aud-001',
    name: 'Login bem-sucedido',
    status: 'OK',
    summary: 'admin@infracare.local acessou o painel',
    updatedAt: '2026-04-18T08:21:00.000Z',
    details: 'POST /auth/login',
  },
  {
    id: 'aud-002',
    name: 'Consulta de incidentes',
    status: 'INFO',
    summary: 'Leitura da lista de incidentes críticos',
    updatedAt: '2026-04-18T08:20:30.000Z',
    details: 'GET /incidents',
  },
  {
    id: 'aud-003',
    name: 'Atualização de checklist',
    status: 'WARN',
    summary: 'Ação registrada para auditoria interna',
    updatedAt: '2026-04-18T08:19:00.000Z',
    details: 'PATCH /checklists/executions/chk-2001',
  },
];

export const dashboardCards: Row[] = [
  {
    id: 'dash-assets',
    name: 'Ativos monitorados',
    status: 'OK',
    summary: '127 ativos em operação contínua',
    updatedAt: '2026-04-18T08:21:00.000Z',
    details: '98% online',
  },
  {
    id: 'dash-incidents',
    name: 'Incidentes abertos',
    status: 'CRITICAL',
    summary: '4 incidentes exigem atenção imediata',
    updatedAt: '2026-04-18T08:21:00.000Z',
    details: '1 escalado para gerente',
  },
  {
    id: 'dash-sla',
    name: 'SLA no prazo',
    status: 'OK',
    summary: '96% dos tickets dentro da meta',
    updatedAt: '2026-04-18T08:21:00.000Z',
    details: 'Monitoramento diário',
  },
];

export const statusRows: Row[] = [
  {
    id: 'svc-portal',
    name: 'Portal do Paciente',
    status: 'OK',
    summary: 'Resposta normalizada em 180ms',
    updatedAt: '2026-04-18T08:20:00.000Z',
    details: 'Sem incidentes ativos',
  },
  {
    id: 'svc-emails',
    name: 'Gateway de E-mail',
    status: 'CRITICAL',
    summary: 'Envio interrompido em toda a rede',
    updatedAt: '2026-04-18T08:18:00.000Z',
    details: 'Fila SMTP parada',
  },
  {
    id: 'svc-backup',
    name: 'Rotina de Backup',
    status: 'WARN',
    summary: 'Janela de cópia em atraso de 12 minutos',
    updatedAt: '2026-04-18T08:09:00.000Z',
    details: 'Reexecução em andamento',
  },
];

export const reports: Row[] = [
  {
    id: 'rpt-001',
    name: 'Relatório executivo diário',
    status: 'OK',
    summary: 'Exportado em PDF para diretoria',
    updatedAt: '2026-04-18T08:22:00.000Z',
    details: 'Arquivo /exports/executive-daily.pdf',
  },
  {
    id: 'rpt-002',
    name: 'Incidentes por unidade',
    status: 'INFO',
    summary: 'Planilha consolidada com tendência semanal',
    updatedAt: '2026-04-18T08:14:00.000Z',
    details: 'Arquivo /exports/incidents-by-unit.xlsx',
  },
];

export function sanitizeUser(user: UserRow) {
  const { passwordHash, ...rest } = user;
  return rest;
}

export function findUserByEmail(email: string) {
  return users.find((user) => user.email === email);
}

export function findUserById(id: string) {
  return users.find((user) => user.id === id);
}

export function dashboardSummary() {
  const criticalIncidents = incidents.filter((incident) => incident.status === 'CRITICAL').length;
  const atRiskSla = slaPolicies.filter((policy) => policy.status === 'CRITICAL' || policy.status === 'WARN').length;

  return {
    cards: dashboardCards,
    highlights: [
      { id: 'hl-1', name: 'Incidentes críticos', status: criticalIncidents > 0 ? 'CRITICAL' : 'OK', summary: `${criticalIncidents} eventos precisam de resposta`, updatedAt: '2026-04-18T08:21:00.000Z' },
      { id: 'hl-2', name: 'Políticas SLA em atenção', status: atRiskSla > 0 ? 'WARN' : 'OK', summary: `${atRiskSla} políticas monitoradas`, updatedAt: '2026-04-18T08:21:00.000Z' },
      { id: 'hl-3', name: 'Auditorias recentes', status: 'INFO', summary: `${auditLogs.length} eventos auditados`, updatedAt: '2026-04-18T08:21:00.000Z' },
    ],
  };
}