import { Injectable } from '@nestjs/common';
import { Row, auditLogs } from '../shared/demo-data';

@Injectable()
export class AuditService {
  list(): Row[] {
    return [...auditLogs];
  }

  record(entry: Row) {
    auditLogs.unshift(entry);
  }
}
