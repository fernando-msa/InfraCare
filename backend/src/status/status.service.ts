import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatusService {
  constructor(private prisma: PrismaService) {}

  async list() {
    const services = await this.prisma.serviceStatus.findMany({
      include: { histories: { take: 5, orderBy: { createdAt: 'desc' } } },
      orderBy: { name: 'asc' },
    });

    const incidents = await this.prisma.incident.findMany({
      orderBy: { openedAt: 'desc' },
      take: 30,
      select: { id: true, title: true, type: true, severity: true, openedAt: true, status: true },
    });

    return services.map((service) => ({
      ...service,
      recentIncidents: incidents
        .filter((i) => i.type.toLowerCase().includes(service.name.toLowerCase()) || i.title.toLowerCase().includes(service.name.toLowerCase()))
        .slice(0, 3),
    }));
  }
}
