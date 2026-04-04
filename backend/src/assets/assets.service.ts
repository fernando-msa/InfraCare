import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import { AssetStatus } from '@prisma/client';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}
  list() { return this.prisma.asset.findMany({ include: { unit: true, sector: true }, orderBy: { name: 'asc' } }); }
  create(data: any) { return this.prisma.asset.create({ data }); }
  update(id: string, data: any) { return this.prisma.asset.update({ where: { id }, data }); }

  @Cron('*/10 * * * * *')
  async simulateHealthCheck() {
    const assets = await this.prisma.asset.findMany({ take: 5, orderBy: { updatedAt: 'desc' } });
    for (const asset of assets) {
      if (Math.random() < 0.2) {
        const next = [AssetStatus.ONLINE, AssetStatus.UNSTABLE, AssetStatus.OFFLINE][Math.floor(Math.random() * 3)];
        if (next !== asset.currentStatus) {
          await this.prisma.asset.update({ where: { id: asset.id }, data: { currentStatus: next, lastCheckAt: new Date() } });
          await this.prisma.assetStatusHistory.create({ data: { assetId: asset.id, fromStatus: asset.currentStatus, toStatus: next, reason: 'Job interno de simulação' } });
        }
      }
    }
  }
}
