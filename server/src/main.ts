import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { env } from './config/env';
import { Logger } from 'pino';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

const isProduction = env.NODE_ENV === 'production';

async function configureApp(app: INestApplication) {
  // Security headers with explicit HSTS for production
  app.use(helmet({
    hsts: isProduction ? {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    } : false,
    contentSecurityPolicy: false, // Adjust if needed for your frontend
  }));
  
  // Cookie parser with secret
  app.use(cookieParser(env.COOKIE_SECRET));
  
  // CORS configuration
  const allowedOrigins = Array.from(
    new Set([
      env.CLIENT_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173',
    ].filter(Boolean))
  );

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe with strict settings
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
}

async function bootstrap() {
  console.log('Starting bootstrap...');
  const app = await NestFactory.create(AppModule);
  await configureApp(app);
  
  const port = Number(env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Server listening on http://localhost:${port}`);
}

bootstrap();
