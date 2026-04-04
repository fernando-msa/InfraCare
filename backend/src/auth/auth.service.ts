import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  /**
   * Revoked refresh tokens tracked in memory.
   * NOTE: This set is not shared across multiple instances and is cleared on restart.
   * For production deployments, persist revoked JTIs in the database or a Redis cache
   * with TTL equal to the refresh token lifetime.
   */
  private revokedRefreshTokens = new Set<string>();

  /** Maximum number of revoked tokens to hold in memory before clearing old entries. */
  private readonly MAX_REVOKED_TOKENS = 10_000;

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
    if (refreshToken) {
      // Evict the oldest 10 % of entries when the set is at capacity to prevent
      // unbounded memory growth while amortising the eviction cost.
      if (this.revokedRefreshTokens.size >= this.MAX_REVOKED_TOKENS) {
        const evictCount = Math.ceil(this.MAX_REVOKED_TOKENS * 0.1);
        const iter = this.revokedRefreshTokens.values();
        for (let n = 0; n < evictCount; n++) {
          const entry = iter.next().value;
          if (entry !== undefined) this.revokedRefreshTokens.delete(entry);
        }
      }
      this.revokedRefreshTokens.add(refreshToken);
    }
    return { message: 'Logout realizado com sucesso' };
  }
}
