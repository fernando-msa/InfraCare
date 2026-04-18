import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly service: UsersService) {}

	@Roles('ADMIN', 'ANALYST', 'MANAGER')
	@Get()
	list() {
		return this.service.list();
	}
}
