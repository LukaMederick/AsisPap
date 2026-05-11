import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';

async function fixIdentitySequences(dataSource: DataSource) {
  const tables = [
    'offices',
    'roles',
    'permissions',
    'schedules',
    'permission_types',
    'users',
    'permission_requests',
    'attendance_records',
  ];

  for (const table of tables) {
    await dataSource.query(
      `SELECT pg_catalog.setval(pg_get_serial_sequence($1, 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 1), true)`,
      [table],
    );
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:4200',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  try {
    const dataSource = app.get(DataSource);
    await fixIdentitySequences(dataSource);
  } catch (error) {
    console.error('Failed to fix identity sequences:', error);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
