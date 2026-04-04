import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SlaService {
  constructor(private prisma: PrismaService) {}
  async indicators() {
    const tickets = await this.prisma.ticket.findMany();
    const outside = tickets.filter((t) => t.slaDeadline < new Date() && t.status !== 'CLOSED' && t.status !== 'RESOLVED').length;
    return {
      totalTickets: tickets.length,
      insideSla: tickets.length - outside,
      outsideSla: outside,
      outsidePercentage: tickets.length ? Number(((outside / tickets.length) * 100).toFixed(2)) : 0,
    };
  }
}
