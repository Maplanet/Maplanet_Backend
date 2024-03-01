import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingInterceptor } from './logger/logger.interceptor';
// import * as session from 'express-session';
// import * as FileStore from 'session-file-store';

async function bootstrap() {

  // const FileStoreInstance = FileStore(session);
  const app = await NestFactory.create(AppModule);
  // app.use(
  //   session({
  //     secret: 'my-secret',
  //     resave: false,
  //     saveUninitialized: false,  
  //     store: new FileStoreInstance({  
  //       path: './sessions', // 세션 파일이 저장될 경로
  //       //client: client,
  //       ttl: 30000,  
  //     }),
  //     cookie: {
  //       httpOnly: true,
  //       secure: true,
  //       maxAge: 30000,  //세션이 redis에 저장되는 기간은 maxAge로 조절한다.(ms)
  //     },
  //   }),
  // )
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('Maplanet API')
    .setDescription('메이플래닛 Swagger')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
