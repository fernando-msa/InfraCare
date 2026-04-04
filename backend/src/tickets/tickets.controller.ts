import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketsService } from './tickets.service';

@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly service: TicketsService) {}

  @Roles('ADMIN', 'ANALYST', 'TECHNICIAN', 'MANAGER')
  @Get()
  list() { return this.service.list(); }

  @Roles('ADMIN', 'ANALYST', 'TECHNICIAN')
  @Post()
  create(@Body() body: CreateTicketDto) {
    return this.service.create({ ...body, slaDeadline: new Date(body.slaDeadline) });
  }

  @Roles('ADMIN', 'ANALYST', 'TECHNICIAN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateTicketDto) {
    const payload = body.slaDeadline ? { ...body, slaDeadline: new Date(body.slaDeadline) } : body;
    return this.service.update(id, payload);
  }
}
