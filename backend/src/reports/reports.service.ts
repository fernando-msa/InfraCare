import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async overview() {
    const [incidentsBySeverity, ticketsBySector, checklists] = await Promise.all([
      this.prisma.incident.groupBy({ by: ['severity'], _count: true }),
      this.prisma.ticket.groupBy({ by: ['sectorId'], _count: true }),
      this.prisma.checklistExecution.groupBy({ by: ['status'], _count: true }),
    ]);
    return { incidentsBySeverity, ticketsBySector, checklists };
  }

  async exportCsv(type: 'incidents' | 'tickets' | 'checklists') {
    if (type === 'incidents') {
      const incidents = await this.prisma.incident.findMany({ orderBy: { openedAt: 'desc' }, take: 100 });
      const header = 'id,title,severity,status,openedAt\n';
      const rows = incidents.map((i) => `${i.id},"${i.title}",${i.severity},${i.status},${i.openedAt.toISOString()}`).join('\n');
      return header + rows;
    }

    if (type === 'tickets') {
      const tickets = await this.prisma.ticket.findMany({ orderBy: { openedAt: 'desc' }, take: 100 });
      const header = 'id,number,title,priority,status,slaDeadline\n';
      const rows = tickets.map((t) => `${t.id},${t.number},"${t.title}",${t.priority},${t.status},${t.slaDeadline.toISOString()}`).join('\n');
      return header + rows;
    }

    const checklists = await this.prisma.checklistExecution.findMany({ orderBy: { dueDate: 'desc' }, take: 100 });
    const header = 'id,status,result,dueDate,executedAt\n';
    const rows = checklists
      .map((c) => `${c.id},${c.status},"${c.result || ''}",${c.dueDate.toISOString()},${c.executedAt ? c.executedAt.toISOString() : ''}`)
      .join('\n');
    return header + rows;
  }
}
