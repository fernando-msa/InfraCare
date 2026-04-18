import { Injectable } from '@nestjs/common';
import { checklistExecutions } from '../shared/demo-data';

@Injectable()
export class ChecklistsService {
	listExecutions() {
		return [...checklistExecutions];
	}
}
