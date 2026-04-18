import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service';
import { Row } from '../shared/demo-data';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path, body, ip } = request;
    const user = request.user as { sub?: string; email?: string } | undefined;

    const shouldAudit = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method);
    if (!shouldAudit || path.startsWith('/audit')) return next.handle();

    return next.handle().pipe(
      tap({
        next: () => {
          const entry: Row = {
            id: `${method.toLowerCase()}-${Date.now()}`,
            name: `${method} ${path}`,
            status: 'INFO',
            summary: `Ação executada por ${user?.email || 'usuário autenticado'}`,
            updatedAt: new Date().toISOString(),
            details: `ip=${ip}; entityId=${body?.id || 'n/a'}`,
          };

          try {
            this.auditService.record(entry);
          } catch (error) {
            this.logger.error('Audit log write failed', error as Error);
          }
        },
      }),
    );
  }
}
