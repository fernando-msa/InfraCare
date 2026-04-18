import { Injectable } from '@nestjs/common';
import { slaPolicies } from '../shared/demo-data';

@Injectable()
export class SlaService {
  indicators() {
    const total = slaPolicies.length;
    const outside = slaPolicies.filter((policy) => policy.status === 'CRITICAL' || policy.status === 'WARN').length;

    return {
      totalPolicies: total,
      insideSla: total - outside,
      outsideSla: outside,
      outsidePercentage: total ? Number(((outside / total) * 100).toFixed(2)) : 0,
      policies: [...slaPolicies],
    };
  }
}
