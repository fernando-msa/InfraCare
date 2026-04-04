import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatusService {
  constructor(private prisma: PrismaService) {}
  list() { return this.prisma.serviceStatus.findMany({ include: { histories: { take: 3, orderBy: { createdAt: 'desc' } } } }); }
}
