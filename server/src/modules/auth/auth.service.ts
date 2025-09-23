import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject('JWT_STRATEGY_CONFIG') private jwtStrategyConfig: { secret: string, expiresIn: string },
    @Inject('JWT_REFRESH_CONFIG') private jwtRefreshConfig: { secret: string, expiresIn: string },
  ) {}

  async generateRefreshToken(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user.id, email: user.email, role: user.role },
        { secret: this.jwtStrategyConfig.secret, expiresIn: this.jwtStrategyConfig.expiresIn }
      ),
      this.jwtService.signAsync(
        { sub: user.id, email: user.email, role: user.role },
        { secret: this.jwtRefreshConfig.secret, expiresIn: this.jwtRefreshConfig.expiresIn }
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const results = await this.generateRefreshToken(user);

    return {
      access_token: results.accessToken,
      refresh_token: results.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string): Promise<LoginResponse> {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.jwtRefreshConfig.secret
    });

    const user = await this.prisma.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const results = await this.generateRefreshToken(user);

    return {
      access_token: results.accessToken,
      user,
      refresh_token: results.refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    //await this.prisma.refreshToken.delete({ where: { token: refreshToken } });
    return;
  }

  async validateToken(token: string): Promise<{ valid: boolean; payload?: any }> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return { valid: true, payload };
    } catch (error) {
      return { valid: false };
    }
  }
}
