import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** Characters that can trigger spreadsheet formula injection */
const FORMULA_PREFIXES = ['=', '+', '-', '@', '\t', '\r'];

/** Escape a value for safe inclusion in a CSV cell */
function csvEscape(value: string | null | undefined): string {
  const str = value == null ? '' : String(value);
  // Neutralise formula injection
  const safe = FORMULA_PREFIXES.some((p) => str.startsWith(p)) ? `'${str}` : str;
  // Wrap in double-quotes and escape inner double-quotes
  return `"${safe.replace(/"/g, '""')}"`;
}

interface IncidentRow { id: string; title: string; severity: string; status: string; openedAt: Date }
interface TicketRow { id: string; number: number; title: string; priority: string; status: string; slaDeadline: Date }
interface ChecklistRow { id: string; status: string; result: string | null; dueDate: Date; executedAt: Date | null }

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
      const rows = (incidents as IncidentRow[])
        .map((i) =>
          [csvEscape(i.id), csvEscape(i.title), csvEscape(i.severity), csvEscape(i.status), csvEscape(i.openedAt.toISOString())].join(','),
        )
        .join('\n');
      return header + rows;
    }

    if (type === 'tickets') {
      const tickets = await this.prisma.ticket.findMany({ orderBy: { openedAt: 'desc' }, take: 100 });
      const header = 'id,number,title,priority,status,slaDeadline\n';
      const rows = (tickets as TicketRow[])
        .map((t) =>
          [
            csvEscape(t.id),
            csvEscape(String(t.number)),
            csvEscape(t.title),
            csvEscape(t.priority),
            csvEscape(t.status),
            csvEscape(t.slaDeadline.toISOString()),
          ].join(','),
        )
        .join('\n');
      return header + rows;
    }

    const checklists = await this.prisma.checklistExecution.findMany({ orderBy: { dueDate: 'desc' }, take: 100 });
    const header = 'id,status,result,dueDate,executedAt\n';
    const rows = (checklists as ChecklistRow[])
      .map((c) =>
        [
          csvEscape(c.id),
          csvEscape(c.status),
          csvEscape(c.result),
          csvEscape(c.dueDate.toISOString()),
          csvEscape(c.executedAt ? c.executedAt.toISOString() : null),
        ].join(','),
      )
      .join('\n');
    return header + rows;
  }
}
