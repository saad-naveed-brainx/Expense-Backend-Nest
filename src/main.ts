import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './global.exception.filter';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({

    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  app.use(cookieParser());

  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


// import express from 'express';   // ✅ default import
// import { ExpressAdapter } from '@nestjs/platform-express';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// const server = express();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
//   await app.init(); // don't call listen()
// }

// bootstrap();

// export default server;




