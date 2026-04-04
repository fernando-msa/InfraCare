import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { ChecklistsService } from './checklists.service';

@UseGuards(JwtAuthGuard)
@Controller('checklists')
export class ChecklistsController {
  constructor(private readonly service: ChecklistsService) {}
  @Get('executions') list() { return this.service.list(); }
  @Patch('executions/:id/complete') complete(@Param('id') id: string, @Body() body: any) { return this.service.complete(id, body); }
  @Post('items/respond') respondItem(@Body() body: any) { return this.service.respondItem(body); }
}
