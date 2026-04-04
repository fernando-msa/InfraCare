import { PrismaClient, RoleName, UserStatus, AssetStatus, Criticality, Severity, IncidentStatus, ChecklistPeriodicity, ChecklistExecutionStatus, ChecklistItemResult, Priority, TicketStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.incidentTimeline.deleteMany(),
    prisma.incident.deleteMany(),
    prisma.ticketTimeline.deleteMany(),
    prisma.ticket.deleteMany(),
    prisma.checklistExecutionItem.deleteMany(),
    prisma.checklistExecution.deleteMany(),
    prisma.checklistTemplateItem.deleteMany(),
    prisma.checklistTemplate.deleteMany(),
    prisma.assetStatusHistory.deleteMany(),
    prisma.asset.deleteMany(),
    prisma.serviceStatusHistory.deleteMany(),
    prisma.serviceStatus.deleteMany(),
    prisma.user.deleteMany(),
    prisma.role.deleteMany(),
    prisma.sector.deleteMany(),
    prisma.unit.deleteMany(),
    prisma.slaPolicy.deleteMany(),
  ]);

  const [adminRole, analystRole, technicianRole, managerRole] = await Promise.all([
    prisma.role.create({ data: { name: RoleName.ADMIN } }),
    prisma.role.create({ data: { name: RoleName.ANALYST } }),
    prisma.role.create({ data: { name: RoleName.TECHNICIAN } }),
    prisma.role.create({ data: { name: RoleName.MANAGER } }),
  ]);

  const units = await Promise.all([
    prisma.unit.create({ data: { name: 'Hospital Central São Lucas', code: 'HCSL' } }),
    prisma.unit.create({ data: { name: 'Hospital Norte Vida', code: 'HNV' } }),
  ]);

  const sectors = await Promise.all([
    prisma.sector.create({ data: { name: 'CPD', unitId: units[0].id } }),
    prisma.sector.create({ data: { name: 'UTI', unitId: units[0].id } }),
    prisma.sector.create({ data: { name: 'Radiologia', unitId: units[1].id } }),
    prisma.sector.create({ data: { name: 'Pronto Atendimento', unitId: units[1].id } }),
  ]);

  const passwordHash = await bcrypt.hash('Infracare@123', 10);
  const users = await Promise.all([
    prisma.user.create({ data: { name: 'Admin InfraCare', email: 'admin@infracare.local', passwordHash, roleId: adminRole.id, status: UserStatus.ACTIVE, unitId: units[0].id } }),
    prisma.user.create({ data: { name: 'Ana Analista', email: 'ana@infracare.local', passwordHash, roleId: analystRole.id, status: UserStatus.ACTIVE, unitId: units[0].id } }),
    prisma.user.create({ data: { name: 'Bruno Analista', email: 'bruno@infracare.local', passwordHash, roleId: analystRole.id, status: UserStatus.ACTIVE, unitId: units[1].id } }),
    prisma.user.create({ data: { name: 'Caio Técnico', email: 'caio@infracare.local', passwordHash, roleId: technicianRole.id, status: UserStatus.ACTIVE, unitId: units[0].id } }),
    prisma.user.create({ data: { name: 'Duda Técnica', email: 'duda@infracare.local', passwordHash, roleId: technicianRole.id, status: UserStatus.ACTIVE, unitId: units[1].id } }),
    prisma.user.create({ data: { name: 'Guilherme Gestor', email: 'gestor@infracare.local', passwordHash, roleId: managerRole.id, status: UserStatus.ACTIVE, unitId: units[0].id } }),
  ]);

  const assetTypes = ['servidor', 'switch', 'access point', 'nobreak', 'impressora', 'firewall', 'sistema', 'banco de dados', 'serviço web', 'câmera'];
  const assets = [];
  for (let i = 1; i <= 22; i++) {
    const a = await prisma.asset.create({
      data: {
        name: `Ativo ${i}`,
        type: assetTypes[i % assetTypes.length],
        category: i % 2 === 0 ? 'Infraestrutura' : 'Aplicação',
        hostname: `infra-${i.toString().padStart(2, '0')}`,
        ip: `10.10.${Math.floor(i / 10)}.${10 + i}`,
        location: i % 2 === 0 ? 'CPD Principal' : 'Bloco Assistencial',
        unitId: units[i % 2].id,
        sectorId: sectors[i % sectors.length].id,
        description: 'Ativo monitorado no ambiente hospitalar',
        currentStatus: i % 9 === 0 ? AssetStatus.OFFLINE : i % 5 === 0 ? AssetStatus.UNSTABLE : AssetStatus.ONLINE,
        criticality: i % 7 === 0 ? Criticality.CRITICAL : i % 3 === 0 ? Criticality.HIGH : Criticality.MEDIUM,
        monitoringMethod: 'mock-health-check',
        checkIntervalMin: 5,
        lastCheckAt: new Date(),
      },
    });
    assets.push(a);
    await prisma.assetStatusHistory.create({ data: { assetId: a.id, fromStatus: AssetStatus.ONLINE, toStatus: a.currentStatus, reason: 'Seed inicial' } });
  }

  for (let i = 1; i <= 12; i++) {
    const severity = [Severity.LOW, Severity.MEDIUM, Severity.HIGH, Severity.CRITICAL][i % 4];
    const incident = await prisma.incident.create({
      data: {
        title: `Incidente ${i} - ${severity}`,
        description: 'Ocorrência operacional em ambiente hospitalar.',
        type: i % 2 === 0 ? 'Rede' : 'Sistema',
        severity,
        impact: i % 2 === 0 ? 'Parcial' : 'Alto',
        origin: 'Monitoramento interno',
        assetId: assets[i % assets.length].id,
        sectorId: sectors[i % sectors.length].id,
        unitId: units[i % units.length].id,
        status: i % 5 === 0 ? IncidentStatus.RESOLVED : IncidentStatus.OPEN,
        responsibleId: users[(i % 4) + 1].id,
      },
    });
    await prisma.incidentTimeline.create({ data: { incidentId: incident.id, action: 'CREATE', description: 'Incidente registrado via seed.' } });
  }

  for (let i = 1; i <= 16; i++) {
    const ticket = await prisma.ticket.create({
      data: {
        number: `INC-TKT-${1000 + i}`,
        title: `Chamado ${i}`,
        description: 'Solicitação técnica de suporte hospitalar.',
        requester: i % 2 === 0 ? 'Enfermagem' : 'Recepção',
        sectorId: sectors[i % sectors.length].id,
        unitId: units[i % units.length].id,
        category: i % 2 === 0 ? 'Rede' : 'Aplicação',
        priority: [Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.CRITICAL][i % 4],
        status: i % 6 === 0 ? TicketStatus.ESCALATED : TicketStatus.OPEN,
        technicianId: users[(i % 2) + 3].id,
        slaDeadline: new Date(Date.now() + (i % 3 === 0 ? -1 : 1) * 60 * 60 * 1000),
      },
    });
    await prisma.ticketTimeline.create({ data: { ticketId: ticket.id, action: 'CREATE', description: 'Chamado criado via seed.' } });
  }

  const templates = [
    'temperatura do CPD',
    'verificação semanal de rack',
    'qualidade do Wi-Fi',
    'estoque de TI',
    'verificação de backup',
    'verificação de antivírus',
    'checagem de links e conectividade',
  ];

  for (const title of templates) {
    const template = await prisma.checklistTemplate.create({ data: { title, category: 'Operacional', periodicity: ChecklistPeriodicity.WEEKLY } });
    const item1 = await prisma.checklistTemplateItem.create({ data: { templateId: template.id, label: `${title} - item crítico`, critical: true } });
    await prisma.checklistTemplateItem.create({ data: { templateId: template.id, label: `${title} - item padrão`, critical: false } });

    const execution = await prisma.checklistExecution.create({
      data: {
        templateId: template.id,
        responsibleId: users[3].id,
        unitId: units[0].id,
        sectorId: sectors[0].id,
        status: ChecklistExecutionStatus.PENDING,
        dueDate: new Date(Date.now() + 24 * 3600 * 1000),
      },
    });

    await prisma.checklistExecutionItem.create({
      data: {
        executionId: execution.id,
        templateItemId: item1.id,
        result: ChecklistItemResult.COMPLIANT,
      },
    });
  }

  const services = ['Rede', 'Servidores', 'Sistemas', 'Banco de Dados', 'Internet', 'Backup', 'Wi-Fi'];
  for (const name of services) {
    const service = await prisma.serviceStatus.create({ data: { name, category: 'core', status: AssetStatus.ONLINE } });
    await prisma.serviceStatusHistory.create({ data: { serviceId: service.id, status: AssetStatus.ONLINE, summary: 'Operação estável.' } });
  }

  await prisma.auditLog.createMany({
    data: [
      { userId: users[0].id, action: 'LOGIN', entity: 'Auth', description: 'Login realizado', ip: '10.0.0.10' },
      { userId: users[0].id, action: 'CREATE_USER', entity: 'User', description: 'Usuário técnico criado', ip: '10.0.0.10' },
      { userId: users[1].id, action: 'UPDATE_ASSET_STATUS', entity: 'Asset', description: 'Ativo alterado para instável', ip: '10.0.0.20' },
      { userId: users[2].id, action: 'EXECUTE_CHECKLIST', entity: 'ChecklistExecution', description: 'Checklist semanal executado', ip: '10.0.0.30' },
    ],
  });

  await prisma.slaPolicy.createMany({
    data: [
      { name: 'SLA Padrão Baixa', priority: Priority.LOW, firstResponseMin: 120, resolutionMin: 480 },
      { name: 'SLA Crítico', priority: Priority.CRITICAL, firstResponseMin: 15, resolutionMin: 60 },
    ],
  });

  console.log('Seed concluído. Usuário admin: admin@infracare.local / Infracare@123');
}

main().finally(() => prisma.$disconnect());
