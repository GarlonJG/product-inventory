import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 201, description: 'Successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return current user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req) {
    return req.user;
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
