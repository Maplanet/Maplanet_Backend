import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingInterceptor } from './logger/logger.interceptor';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import * as cookieParser from 'cookie-parser';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { WebhookInterceptor } from './common/Webhook.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Sentry.init({
  //   dsn: 'https://8c118dae7cb1252cb803eca999cc896c@o4506898572902400.ingest.us.sentry.io/4506898575851520',
  //   integrations: [new ProfilingIntegration()],
  //   // Performance Monitoring
  //   tracesSampleRate: 0.2,
  //   // Set sampling rate for profiling - this is relative to tracesSampleRate
  //   profilesSampleRate: 1.0,
  // });\

  //app.useGlobalInterceptors(new WebhookInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      //요청 데이터를 유호성검사전에 자동으로 변환함
      //문자형 숫자 => 숫자로 변환
      transform: true,
      //요청데이터에서 유효하지 않은 속성제거
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());
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
