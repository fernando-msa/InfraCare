import { Injectable } from '@nestjs/common';
import { tickets } from '../shared/demo-data';

@Injectable()
export class TicketsService {
  list() {
    return [...tickets];
  }
}
