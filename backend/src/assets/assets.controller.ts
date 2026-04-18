import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { AssetsService } from './assets.service';

@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
	constructor(private readonly service: AssetsService) {}

	@Roles('ADMIN', 'ANALYST', 'TECHNICIAN', 'MANAGER')
	@Get()
	list() {
		return this.service.list();
	}
}
