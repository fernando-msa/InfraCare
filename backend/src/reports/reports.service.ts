import { Injectable } from '@nestjs/common';
import { reports } from '../shared/demo-data';

@Injectable()
export class ReportsService {
	list() {
		return [...reports];
	}
}
