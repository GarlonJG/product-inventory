import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  
  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  
  await app.listen(process.env.API_PORT ?? 3000).then(() => {
    console.log(`Server is running on port ${process.env.API_PORT ?? 3000}`);
    console.log(`API available at http://localhost:${process.env.API_PORT ?? 3000}/api`);
  });
}

bootstrap();
