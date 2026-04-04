import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}
  list() { return this.prisma.incident.findMany({ include: { asset: true, responsible: true }, orderBy: { openedAt: 'desc' } }); }
  async create(data: any) {
    const incident = await this.prisma.incident.create({ data });
    await this.prisma.incidentTimeline.create({ data: { incidentId: incident.id, action: 'CREATE', description: 'Incidente criado' } });
    return incident;
  }
  update(id: string, data: any) { return this.prisma.incident.update({ where: { id }, data }); }
}
