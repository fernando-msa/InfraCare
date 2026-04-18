import { Injectable } from '@nestjs/common';
import { assets } from '../shared/demo-data';

@Injectable()
export class AssetsService {
	list() {
		return [...assets];
	}
}
