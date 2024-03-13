import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { captureException } from '@sentry/minimal';
import { catchError, Observable, of } from 'rxjs';
import { IncomingWebhook } from '@slack/client';
import * as Sentry from '@sentry/minimal';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookInterceptor implements NestInterceptor {
  private readonly configService: ConfigService;
  intercept(_: ExecutionContext, next: CallHandler) /** : Observable<any>*/ {
    return next.handle().pipe(
      catchError((error) => {
        Sentry.captureException(error);
        const webhook = new IncomingWebhook(
          'https://hooks.slack.com/services/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',
        );
        webhook.send({
          attachments: [
            {
              color: 'danger',
              text: '에러가 발생했다!',
              fields: [
                {
                  title: `Request Message: ${error.message}`,
                  value: error.stack,
                  short: false,
                },
              ],
              ts: Math.floor(new Date().getTime() / 1000).toString(), // unix form
            },
          ],
        });
        return of(error);
      }),
    );
  }
}
