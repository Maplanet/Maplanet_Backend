import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const currnetTime = Date.now();
    const now = new Date().toLocaleDateString('ko-KR').replaceAll('. ', '-');
    console.log(now);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const contentLength = response.get('content-length');

        const logMessage = `요청 메서드: ${method} 요청엔드포인트: ${originalUrl} 응답코드: ${statusCode} ${contentLength} - ${userAgent} ip주소: ${ip} ${Date.now() - currnetTime}ms `;

        const logFolder = path.join(__dirname, '../../', 'log');
        //const logFolder = '/var/app/log';

        // 로그 폴더가 없으면 생성
        if (!fs.existsSync(logFolder)) {
          fs.mkdirSync(logFolder);
        }

        const logFilePath = path.join(logFolder, `${now}log`);

        // 로그 파일에 기록
        fs.appendFile(logFilePath, logMessage + '\n', (err) => {
          if (err) {
            console.error('Error writing to log file:', err);
          }
        });
        // 로그 파일에 기록

        this.logger.log(logMessage);
      }),
    );
  }
}

// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     console.log('Before...');

//     const now = Date.now();
//     return next
//       .handle()
//       .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
//   }
// }
