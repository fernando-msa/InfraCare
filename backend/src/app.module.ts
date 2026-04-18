import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AuditInterceptor } from './audit/audit.interceptor';
import { AuditModule } from './audit/audit.module';
import { AssetsModule } from './assets/assets.module';
import { ChecklistsModule } from './checklists/checklists.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { IncidentsModule } from './incidents/incidents.module';
import { ReportsModule } from './reports/reports.module';
import { RolesGuard } from './common/roles.guard';
import { SlaModule } from './sla/sla.module';
import { StatusModule } from './status/status.module';
import { TicketsModule } from './tickets/tickets.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AssetsModule,
    IncidentsModule,
    TicketsModule,
    ChecklistsModule,
    SlaModule,
    AuditModule,
    DashboardModule,
    StatusModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}