// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { AllExceptionsFilter } from './global.exception.filter';
// import { ValidationPipe } from '@nestjs/common';
// import cookieParser from 'cookie-parser';


// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors({

//     origin: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//   });

//   app.useGlobalPipes(new ValidationPipe({
//     forbidNonWhitelisted: true,
//     transform: true,
//     transformOptions: { enableImplicitConversion: true },
//   }));

//   app.use(cookieParser());

//   app.useGlobalFilters(new AllExceptionsFilter());
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverlessExpress from '@vendia/serverless-express';

let server: any;

async function bootstrap() {
  if (!server) {
    const app = await NestFactory.create(AppModule);
    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();
    server = serverlessExpress({ app: expressApp });
  }
  return server;
}

// 👇 Vercel needs "export default"
export default async function handler(req: any, res: any) {
  const expressHandler = await bootstrap();
  return expressHandler(req, res);
}


