import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { ReportsService } from './reports.service';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Roles('ADMIN', 'ANALYST', 'MANAGER')
  @Get()
  overview() {
    return this.service.overview();
  }

  @Roles('ADMIN', 'ANALYST', 'MANAGER')
  @Get('export')
  async exportCsv(
    @Query('type') type: 'incidents' | 'tickets' | 'checklists' = 'incidents',
    @Res() res: Response,
  ) {
    const csv = await this.service.exportCsv(type);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${type}.csv"`);
    res.send(csv);
  }
}
