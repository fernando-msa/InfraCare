import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private revokedRefreshTokens = new Set<string>();

  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  private createTokens(user: { id: string; email: string; role: { name: string } }) {
    const payload = { sub: user.id, email: user.email, role: user.role.name };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '8h' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    const tokens = this.createTokens(user);
    return {
      ...tokens,
      user: { id: user.id, name: user.name, email: user.email, role: user.role.name },
    };
  }

  async refresh(refreshToken: string) {
    if (this.revokedRefreshTokens.has(refreshToken)) {
      throw new UnauthorizedException('Sessão inválida');
    }

    const payload = await this.jwtService.verifyAsync<{ sub: string; email: string; role: string }>(refreshToken);
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    return this.createTokens(user);
  }

  logout(refreshToken?: string) {
    if (refreshToken) this.revokedRefreshTokens.add(refreshToken);
    return { message: 'Logout realizado com sucesso' };
  }
}
