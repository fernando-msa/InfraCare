import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { findUserByEmail, findUserById, sanitizeUser } from '../shared/demo-data';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = findUserByEmail(String(email || '').trim().toLowerCase());
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatches = await bcrypt.compare(password || '', user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      accessToken: await this.jwtService.signAsync({ sub: user.id, email: user.email, role: user.role, name: user.name }),
      user: sanitizeUser(user),
    };
  }

  me(userId: string) {
    const user = findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return sanitizeUser(user);
  }
}