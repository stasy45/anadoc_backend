import cookieParser from 'cookie-parser';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

import { AppModule } from './app.module';
import { APP_PORT } from './env';
import { ErrorBoundaryFilter } from './utils/error-boundary.filter';



const createValidationException = (errors: ValidationError[]) => {
  const validationErrors = errors.reduce<Record<string, string>>(
    (acc, { property, constraints }) => {
      const message = constraints && Object.values(constraints)[0];

      if (message) {
        acc[property] = message;
      }

      return acc;
    },
    {},
  );

  return new BadRequestException(validationErrors);
};

const createValidationPipe = () =>
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: createValidationException,
  });

const configureApp = (app: Awaited<ReturnType<typeof NestFactory.create>>) => {
  app.setGlobalPrefix('api');

  app.use(cookieParser());
  app.use(express.json({ strict: false }));

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new ErrorBoundaryFilter());
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);

  await app.listen(APP_PORT);
}

void bootstrap();