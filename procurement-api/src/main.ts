/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MethodNotAllowedException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/exception-filters';

import cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';
import { getRabbitMqUrl, RABBITMQ_QUEUE } from './messaging/rabbit.constants';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: (origin, callback) => {
      const allowed = (process.env.FRONTEND_URL ?? 'http://localhost:3001')
        .split(',')
        .map((o) => o.trim());
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new MethodNotAllowedException(`CORS: origin ${origin} not allowed`),
        );
      }
    },
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Procurement API')
    .setDescription(
      'API documentation for procurement platform authentication and resources.',
    )
    .setVersion('1.0')
    .build();
  SwaggerModule.setup(
    'api',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
    {
      swaggerOptions: {
        docExpansion: 'none',
      },
    },
  );
  app.connectMicroservice({
    transport: Transport.RMQ,

    options: {
      urls: [getRabbitMqUrl()],

      queue: RABBITMQ_QUEUE,

      queueOptions: {
        durable: true,
      },

      noAck: false,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 5000);
}
void bootstrap();
