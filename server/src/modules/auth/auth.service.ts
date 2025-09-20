import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface LoginResponse {
  access_token: string;
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
  ) {}

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

    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
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
