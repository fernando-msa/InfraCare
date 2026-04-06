import { Injectable } from '@nestjs/common';
import { ChecklistItemResult } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChecklistsService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.checklistExecution.findMany({
      include: { template: true, responsible: true, unit: true, sector: true },
      orderBy: { dueDate: 'asc' },
    });
  }

  async complete(id: string, payload: { result: string; observations?: string; criticalFailure?: boolean }) {
    const execution = await this.prisma.checklistExecution.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        executedAt: new Date(),
        result: payload.result,
        observations: payload.observations,
      },
    });

    if (payload.criticalFailure) {
      await this.prisma.incident.create({
        data: {
          title: `Falha crítica em checklist ${execution.id}`,
          description: payload.observations || 'Falha crítica detectada',
          type: 'Checklist',
          severity: 'CRITICAL',
          impact: 'Alto',
          origin: 'Checklist',
          sectorId: execution.sectorId,
          unitId: execution.unitId,
          status: 'OPEN',
        },
      });
    }

    return execution;
  }

  async respondItem(data: {
    executionId: string;
    templateItemId: string;
    result: 'COMPLIANT' | 'NON_COMPLIANT' | 'NOT_APPLICABLE';
    observation?: string;
    evidenceText?: string;
  }) {
    const item = await this.prisma.checklistExecutionItem.create({
      data: { ...data, result: data.result as ChecklistItemResult },
    });

    if (data.result === 'NON_COMPLIANT') {
      const [templateItem, execution] = await Promise.all([
        this.prisma.checklistTemplateItem.findUnique({ where: { id: data.templateItemId } }),
        this.prisma.checklistExecution.findUnique({ where: { id: data.executionId } }),
      ]);

      if (templateItem?.critical && execution) {
        await this.prisma.incident.create({
          data: {
            title: `Não conformidade crítica: ${templateItem.label}`,
            description: data.observation || 'Item crítico falhou em checklist.',
            type: 'Checklist',
            severity: 'CRITICAL',
            impact: 'Alto',
            origin: 'Checklist',
            sectorId: execution.sectorId,
            unitId: execution.unitId,
            status: 'OPEN',
          },
        });
      }
    }

    return item;
  }
}
