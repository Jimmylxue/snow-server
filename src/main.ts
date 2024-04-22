import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as path from 'path';
require('body-parser-xml')(bodyParser);
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    }),
  );
  app.use(
    bodyParser.xml({
      xmlParseOptions: {
        explicitArray: false, // 始终返回数组。默认情况下只有数组元素数量大于 1 是才返回数组。
      },
    }),
  );
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  ); // pipe 处理全局验证
  await app.listen(9999);
}
bootstrap();
