import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { env } from './config/env';
import { Logger } from 'pino';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function configureApp(app: INestApplication) {
  // Security headers
  app.use(helmet());
  
  // Cookie parser with secret
  app.use(cookieParser(env.COOKIE_SECRET));
  
  // CORS configuration
  app.enableCors({
    origin: env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe with strict settings
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    })
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Activer le logger
  await configureApp(app);
  
  const port = Number(env.PORT) || 4000;
  await app.listen(port);
  console.log(` Server listening on http://localhost:${port}`);
}

// Export for Vite
export const viteNodeApp = NestFactory.create(AppModule, { logger: false }).then(async (app) => {
  await configureApp(app);
  return app;
});

// Only run bootstrap if executed directly (not imported by Vite)
if (require.main === module) {
  bootstrap();
}
