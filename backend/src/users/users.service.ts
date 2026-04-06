import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.user.findMany({ include: { role: true, unit: true } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, include: { role: true } });
  }

  async create(data: { name: string; email: string; password: string; roleId: string; unitId?: string }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash, roleId: data.roleId, unitId: data.unitId },
    });
  }

  update(id: string, data: { name?: string; status?: 'ACTIVE' | 'INACTIVE'; roleId?: string; unitId?: string }) {
    return this.prisma.user.update({ where: { id }, data });
  }
}
