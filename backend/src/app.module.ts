import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AssetsModule } from './assets/assets.module';
import { IncidentsModule } from './incidents/incidents.module';
import { ChecklistsModule } from './checklists/checklists.module';
import { TicketsModule } from './tickets/tickets.module';
import { SlaModule } from './sla/sla.module';
import { AuditModule } from './audit/audit.module';
import { ReportsModule } from './reports/reports.module';
import { StatusModule } from './status/status.module';
import { RolesGuard } from './common/roles.guard';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    DashboardModule,
    AssetsModule,
    IncidentsModule,
    ChecklistsModule,
    TicketsModule,
    SlaModule,
    AuditModule,
    ReportsModule,
    StatusModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
