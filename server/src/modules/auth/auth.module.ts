import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_REFRESH_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService, 
    LocalStrategy, 
    JwtStrategy,
    {
      provide: 'JWT_STRATEGY_CONFIG',
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        expiresIn: '1h',
      }),
      inject: [ConfigService],
    },
    {
      provide: 'JWT_REFRESH_CONFIG',
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',  // Should match the signOptions.expiresIn above
      }),
      inject: [ConfigService],
    },

  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
