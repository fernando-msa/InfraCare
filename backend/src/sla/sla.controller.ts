import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { SlaService } from './sla.service';

@UseGuards(JwtAuthGuard)
@Controller('sla')
export class SlaController {
  constructor(private readonly service: SlaService) {}

  @Roles('ADMIN', 'ANALYST', 'MANAGER')
  @Get('indicators')
  indicators() { return this.service.indicators(); }
}
