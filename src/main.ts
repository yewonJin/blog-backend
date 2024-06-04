import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.BASE_URL,
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(8080);
}

bootstrap();
