import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getOptionalEnv } from './env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  const corsOrigin = getOptionalEnv('CORS_ORIGIN', 'http://localhost:3000');

  app.enableCors({ origin: corsOrigin.split(',').map((origin) => origin.trim()), credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = Number(process.env.PORT || 3001);
  await app.listen(port);
}

void bootstrap();