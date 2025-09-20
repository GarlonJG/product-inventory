import { Global, Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from './modules/items/item.module';
import { AuthModule } from './modules/auth/auth.module';
import { SecurityMiddleware } from './middleware/security.middleware';
import { SanitizationMiddleware } from './middleware/sanitization.middleware';

@Global()
@Module({
  imports: [
    ItemModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SecurityMiddleware, SanitizationMiddleware)
      /* .exclude(
        { path: 'health', method: RequestMethod.GET },
        { path: 'public/*' },
      ) */
      .forRoutes('*');
  }
}
