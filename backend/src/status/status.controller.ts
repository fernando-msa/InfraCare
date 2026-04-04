import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { StatusService } from './status.service';

@UseGuards(JwtAuthGuard)
@Controller('status-page')
export class StatusController {
  constructor(private readonly service: StatusService) {}
  @Get() list() { return this.service.list(); }
}
