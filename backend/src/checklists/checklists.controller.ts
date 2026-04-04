import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { ChecklistsService } from './checklists.service';

@UseGuards(JwtAuthGuard)
@Controller('checklists')
export class ChecklistsController {
  constructor(private readonly service: ChecklistsService) {}

  @Roles('ADMIN', 'ANALYST', 'TECHNICIAN', 'MANAGER')
  @Get('executions')
  list() { return this.service.list(); }

  @Roles('ADMIN', 'ANALYST', 'TECHNICIAN')
  @Patch('executions/:id/complete')
  complete(@Param('id') id: string, @Body() body: any) { return this.service.complete(id, body); }

  @Roles('ADMIN', 'ANALYST', 'TECHNICIAN')
  @Post('items/respond')
  respondItem(@Body() body: any) { return this.service.respondItem(body); }
}
