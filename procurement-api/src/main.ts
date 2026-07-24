import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CatchEverythingFilter } from './filters/exception-filters';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));
  console.log(process.env.DATABASE_URL);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Procurement API')
    .setDescription(
      'API documentation for procurement platform authentication and resources.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
    {
      swaggerOptions: {
        docExpansion: 'none',
      },
    },
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
