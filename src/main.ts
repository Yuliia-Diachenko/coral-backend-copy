import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

async function bootstrap() {
  const logger = WinstonModule.createLogger({
    exitOnError: false,
    handleExceptions: true,
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('Coral api', {
            appName: true,
            prettyPrint: true,
            colors: true,
          }),
        ),
      }),
      new winston.transports.DailyRotateFile({
        dirname: process.env.APP_LOGS_DIR_PATH,
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      ,
      new winston.transports.DailyRotateFile({
        dirname: `${process.env.APP_LOGS_DIR_PATH}/errors`,
        level: 'error',
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '60d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.prettyPrint(),
        ),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://coral-frontend-u7qi.vercel.app',
      'https://coralscript.com',
      'https://coralscript.com/provider-account',
      'http://localhost:3000/provider-account/',
    ],
    credentials: true,
  });
  app.use(cookieParser());
  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
