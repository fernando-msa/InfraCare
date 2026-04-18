import { Injectable } from '@nestjs/common';
import { findUserByEmail, findUserById, sanitizeUser, users } from '../shared/demo-data';

@Injectable()
export class UsersService {
	list() {
		return users.map((user) => sanitizeUser(user));
	}

	findById(id: string) {
		const user = findUserById(id);
		return user ? sanitizeUser(user) : null;
	}

	findByEmail(email: string) {
		const user = findUserByEmail(email);
		return user ? sanitizeUser(user) : null;
	}
}
