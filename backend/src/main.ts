import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── Security ──────────────────────────────────────
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ── Global Validation (class-validator + Zod) ─────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── API Prefix ────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── Swagger / OpenAPI ─────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Play12 API')
    .setDescription('Backend da plataforma Play12 Milsim Manager')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('play12_token')
    .addTag('auth', 'Autenticação e registro')
    .addTag('operators', 'Operadores / Jogadores')
    .addTag('squads', 'Unidades Táticas')
    .addTag('games', 'Missões / Eventos')
    .addTag('rankings', 'Ranking de Squads')
    .addTag('payments', 'Pagamentos (Asaas)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ── Start ─────────────────────────────────────────
  const port = process.env.PORT || 3333;
  await app.listen(port);
  console.log(`🎯 Play12 API rodando em http://localhost:${port}`);
  console.log(`📋 Swagger docs em http://localhost:${port}/api/docs`);
}

bootstrap();
