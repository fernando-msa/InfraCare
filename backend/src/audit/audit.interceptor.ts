import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path, body, ip } = request;
    const user = request.user as { sub?: string; email?: string } | undefined;

    const shouldAudit = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method);
    if (!shouldAudit || path.startsWith('/audit')) return next.handle();

    return next.handle().pipe(
      mergeMap((responseBody) =>
        from(
          this.prisma.auditLog.create({
            data: {
              userId: user?.sub,
              action: method,
              entity: path,
              entityId: body?.id || null,
              description: `Ação ${method} executada em ${path}`,
              ip,
            },
          }),
        ).pipe(
          tap({ error: (err) => this.logger.error('Audit log write failed', err) }),
          mergeMap(() => [responseBody]),
        ),
      ),
    );
  }
}
