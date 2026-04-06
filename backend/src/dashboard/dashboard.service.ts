import { Injectable } from '@nestjs/common';
import { AssetStatus, IncidentStatus, Severity, TicketStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async summary() {
    const [totalAssets, onlineAssets, offlineAssets, openIncidents, criticalIncidents, openTickets, pendingChecklists] = await Promise.all([
      this.prisma.asset.count(),
      this.prisma.asset.count({ where: { currentStatus: AssetStatus.ONLINE } }),
      this.prisma.asset.count({ where: { currentStatus: AssetStatus.OFFLINE } }),
      this.prisma.incident.count({ where: { status: { in: [IncidentStatus.OPEN, IncidentStatus.ANALYSIS, IncidentStatus.IN_PROGRESS] } } }),
      this.prisma.incident.count({ where: { severity: Severity.CRITICAL, status: { not: IncidentStatus.CLOSED } } }),
      this.prisma.ticket.count({ where: { status: { in: [TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.ESCALATED] } } }),
      this.prisma.checklistExecution.count({ where: { status: { in: ['PENDING', 'OVERDUE'] } } }),
    ]);

    const lateTickets = await this.prisma.ticket.count({ where: { slaDeadline: { lt: new Date() }, status: { in: [TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.ESCALATED] } } });
    const incidents = await this.prisma.incident.findMany({ take: 8, orderBy: { openedAt: 'desc' } });
    const alerts = await this.prisma.asset.findMany({ where: { currentStatus: { in: [AssetStatus.OFFLINE, AssetStatus.UNSTABLE] } }, take: 8 });

    const [incidentsBySeverity, ticketsByStatus, slaBySector] = await Promise.all([
      this.prisma.incident.groupBy({ by: ['severity'], _count: true }),
      this.prisma.ticket.groupBy({ by: ['status'], _count: true }),
      this.prisma.ticket.groupBy({ by: ['sectorId'], _count: true }),
    ]);

    const sectorIds = slaBySector.map((item) => item.sectorId);
    const sectors = await this.prisma.sector.findMany({ where: { id: { in: sectorIds } } });
    const slaBySectorNamed = slaBySector.map((item) => ({
      sector: sectors.find((s) => s.id === item.sectorId)?.name || item.sectorId,
      total: item._count,
    }));

    return {
      metrics: {
        totalAssets,
        onlineAssets,
        offlineAssets,
        openIncidents,
        criticalIncidents,
        openTickets,
        lateTickets,
        pendingChecklists,
      },
      charts: { incidentsBySeverity, ticketsByStatus, slaBySector: slaBySectorNamed },
      incidents,
      alerts,
    };
  }
}
