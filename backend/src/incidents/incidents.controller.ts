import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { IncidentsService } from './incidents.service';

@UseGuards(JwtAuthGuard)
@Controller('incidents')
export class IncidentsController {
	constructor(private readonly service: IncidentsService) {}

	@Roles('ADMIN', 'ANALYST', 'TECHNICIAN', 'MANAGER')
	@Get()
	list() {
		return this.service.list();
	}
}
