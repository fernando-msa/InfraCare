import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { StatusService } from './status.service';

@UseGuards(JwtAuthGuard)
@Controller('status-page')
export class StatusController {
  constructor(private readonly service: StatusService) {}

  @Roles('ADMIN', 'ANALYST', 'TECHNICIAN', 'MANAGER')
  @Get()
  list() { return this.service.list(); }
}
