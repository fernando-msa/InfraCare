import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { IncidentsService } from './incidents.service';

@UseGuards(JwtAuthGuard)
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly service: IncidentsService) {}

  @Roles('ADMIN', 'ANALYST', 'TECHNICIAN', 'MANAGER')
  @Get()
  list() { return this.service.list(); }

  @Roles('ADMIN', 'ANALYST', 'TECHNICIAN')
  @Post()
  create(@Body() body: CreateIncidentDto) { return this.service.create(body); }

  @Roles('ADMIN', 'ANALYST', 'TECHNICIAN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateIncidentDto) { return this.service.update(id, body); }
}
