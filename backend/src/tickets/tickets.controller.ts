import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { TicketsService } from './tickets.service';

@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketsController {
	constructor(private readonly service: TicketsService) {}

	@Roles('ADMIN', 'ANALYST', 'TECHNICIAN', 'MANAGER')
	@Get()
	list() {
		return this.service.list();
	}
}
