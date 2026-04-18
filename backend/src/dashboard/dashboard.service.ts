import { Injectable } from '@nestjs/common';
import { dashboardSummary } from '../shared/demo-data';

@Injectable()
export class DashboardService {
	summary() {
		return dashboardSummary();
	}
}
