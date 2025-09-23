import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // Load environment variables
  dotenv.config();

  const app = await NestFactory.create(AppModule, { 
    logger: ['error', 'warn', 'log'],
  });
  
  // Use cookie parser other wise won't be able to access cookies
  app.use(cookieParser());

  // Global prefix for all routes
  app.setGlobalPrefix('api');
  
  // Configure CORS
  app.enableCors({
    origin: true, // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  // Enable global validation pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Product Inventory API')
    .setDescription('API documentation for Product Inventory')
    .setVersion('1.0')
    .addServer("http://localhost:5000", "Development Server")
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Configure Swagger UI
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true,
      security: [
        {
          JWT: [],
        },
      ],
    },
  });

  const port = process.env.API_PORT || 3000;
  await app.listen(port).then(() => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📄 API available at http://localhost:${port}/api`);
    console.log(`📚 API documentation available at http://localhost:${port}/api/docs`);
  });
}

bootstrap().catch(err => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
