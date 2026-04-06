import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { Roles } from '../common/roles.decorator';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly service: AssetsService) {}

  @Roles('ADMIN', 'ANALYST', 'TECHNICIAN', 'MANAGER')
  @Get()
  list() { return this.service.list(); }

  @Roles('ADMIN', 'ANALYST')
  @Post()
  create(@Body() body: CreateAssetDto) { return this.service.create(body); }

  @Roles('ADMIN', 'ANALYST', 'TECHNICIAN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateAssetDto) { return this.service.update(id, body); }
}
