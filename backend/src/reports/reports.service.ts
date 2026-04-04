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
}
