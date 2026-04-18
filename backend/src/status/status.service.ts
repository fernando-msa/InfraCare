import { Injectable } from '@nestjs/common';
import { statusRows } from '../shared/demo-data';

@Injectable()
export class StatusService {
	list() {
		return [...statusRows];
	}
}
