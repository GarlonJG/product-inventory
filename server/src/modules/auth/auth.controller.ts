import { Controller, Post, Body, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';

interface RequestWithCookies extends Request {
  cookies: {
    [key: string]: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 201, description: 'Successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {

    const { access_token, refresh_token, user } = await this.authService.login(loginDto.email, loginDto.password);

    // Set refresh token cookie
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax', // or 'strict'
      maxAge: 1000 * 60 * 60 * 24 * 7, // one week
      path: '/api/auth/refresh',
    });

    return { access_token, user };
  }

  @Post('refresh')
  async refresh(@Req() req: RequestWithCookies, @Res({ passthrough: true }) res: Response) {
    console.log("In refresh controller");
    if (!req.cookies['refresh_token']) {
      console.log('No refresh token found in cookies');
      throw new UnauthorizedException('No refresh token provided');
    }
    
    try {

      const refreshToken = req.cookies['refresh_token'];
      console.log('Attempting to refresh with token:', refreshToken);
      
      const { access_token, user, refresh_token: newRefreshToken } = await this.authService.refresh(refreshToken);

      // Set new refresh token cookie for token rotation
      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // or 'strict'
        maxAge: 1000 * 60 * 60 * 24 * 7, // one week
        path: '/',
      });

      return { access_token, user };

    } catch (error) {
      console.error('Refresh token error:', error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res) {
    res.clearCookie('refresh_token', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { message: 'Logged out' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('validate-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate JWT token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async validateToken(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }
    return this.authService.validateToken(token);
  }
}
