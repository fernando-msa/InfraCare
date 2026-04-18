import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { ChecklistsService } from './checklists.service';

@UseGuards(JwtAuthGuard)
@Controller('checklists')
export class ChecklistsController {
	constructor(private readonly service: ChecklistsService) {}

	@Roles('ADMIN', 'ANALYST', 'TECHNICIAN', 'MANAGER')
	@Get('executions')
	listExecutions() {
		return this.service.listExecutions();
	}
}
