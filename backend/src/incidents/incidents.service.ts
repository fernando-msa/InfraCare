import { Injectable } from '@nestjs/common';
import { incidents } from '../shared/demo-data';

@Injectable()
export class IncidentsService {
  list() {
    return [...incidents];
  }
}
