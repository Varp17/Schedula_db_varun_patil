import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS for frontend and OAuth
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'https://accounts.google.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.setGlobalPrefix('api/v1');

  await app.listen(3000);
  console.log('🚀 Schedula Backend running on http://localhost:3000');
  console.log('✅ Google OAuth configured for Patient & Doctor roles!');
}
bootstrap().catch((err) => {
  console.error('Error starting application:', err);
  process.exit(1);
});
