import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface TicketProvider { syncTickets(): Promise<number>; }
export class MockTicketProvider implements TicketProvider { async syncTickets() { return 0; } }

@Injectable()
export class TicketsService {
  private provider: TicketProvider = new MockTicketProvider();
  constructor(private prisma: PrismaService) {}
  list() { return this.prisma.ticket.findMany({ include: { technician: true, unit: true, sector: true }, orderBy: { openedAt: 'desc' } }); }
  async create(data: any) {
    const ticket = await this.prisma.ticket.create({ data });
    await this.prisma.ticketTimeline.create({ data: { ticketId: ticket.id, action: 'CREATE', description: 'Chamado aberto' } });
    return ticket;
  }
  update(id: string, data: any) { return this.prisma.ticket.update({ where: { id }, data }); }
  sync() { return this.provider.syncTickets(); }
}
