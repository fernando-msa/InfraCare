import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { ReportsService } from './reports.service';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
	constructor(private readonly service: ReportsService) {}

	@Roles('ADMIN', 'ANALYST', 'MANAGER')
	@Get()
	list() {
		return this.service.list();
	}
}
