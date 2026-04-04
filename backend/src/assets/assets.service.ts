import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';
import { AssetStatus, Prisma } from '@prisma/client';

type AssetCreateData = {
  name: string;
  imageUrl?: string;
  description?: string;
  model?: string;
  owner?: string;
  healthscore?: number;
  status?: AssetStatus;
  currentStatus?: AssetStatus;
  lastCheckAt?: Date | string;
  unitId?: string;
  sectorId?: string;
};

type AssetUpdateData = Partial<AssetCreateData>;

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  private mapCreateData(data: AssetCreateData): Prisma.AssetCreateInput {
    return {
      name: data.name,
      ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.model !== undefined ? { model: data.model } : {}),
      ...(data.owner !== undefined ? { owner: data.owner } : {}),
      ...(data.healthscore !== undefined ? { healthscore: data.healthscore } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.currentStatus !== undefined ? { currentStatus: data.currentStatus } : {}),
      ...(data.lastCheckAt !== undefined ? { lastCheckAt: new Date(data.lastCheckAt) } : {}),
      ...(data.unitId !== undefined ? { unit: { connect: { id: data.unitId } } } : {}),
      ...(data.sectorId !== undefined ? { sector: { connect: { id: data.sectorId } } } : {}),
    };
  }

  private mapUpdateData(data: AssetUpdateData): Prisma.AssetUpdateInput {
    return {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.model !== undefined ? { model: data.model } : {}),
      ...(data.owner !== undefined ? { owner: data.owner } : {}),
      ...(data.healthscore !== undefined ? { healthscore: data.healthscore } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.currentStatus !== undefined ? { currentStatus: data.currentStatus } : {}),
      ...(data.lastCheckAt !== undefined ? { lastCheckAt: new Date(data.lastCheckAt) } : {}),
      ...(data.unitId !== undefined ? { unit: { connect: { id: data.unitId } } } : {}),
      ...(data.sectorId !== undefined ? { sector: { connect: { id: data.sectorId } } } : {}),
    };
  }

  list() { return this.prisma.asset.findMany({ include: { unit: true, sector: true }, orderBy: { name: 'asc' } }); }
  create(data: AssetCreateData) { return this.prisma.asset.create({ data: this.mapCreateData(data) }); }
  update(id: string, data: AssetUpdateData) { return this.prisma.asset.update({ where: { id }, data: this.mapUpdateData(data) }); }

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
