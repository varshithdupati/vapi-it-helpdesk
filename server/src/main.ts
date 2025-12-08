import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS for frontend and Vapi integration
  app.enableCors({
    origin: true, // Allow all origins for demo purposes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Set global prefix for API routes (exclude health check)
  app.setGlobalPrefix('api', {
    exclude: ['health'],
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`🚀 Acme IT Helpdesk Backend running on http://localhost:${port}`);
  logger.log(`📋 API endpoints available at http://localhost:${port}/api`);
  logger.log(`❤️  Health check at http://localhost:${port}/health`);
}

bootstrap();

