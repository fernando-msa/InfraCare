import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}
  list() { return this.prisma.auditLog.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } }); }
}
