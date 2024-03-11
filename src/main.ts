import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingInterceptor } from './logger/logger.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      //요청 데이터를 유호성검사전에 자동으로 변환함
      //문자형 숫자 => 숫자로 변환
      transform: true,
      //요청데이터에서 유효하지 않은 속성제거
      whitelist: true,
    }),
  );
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
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`Application running on port ${port} ${process.env.NODE_ENV}`);
}
bootstrap();
