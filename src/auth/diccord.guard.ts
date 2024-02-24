import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class DiscordAuthGuard extends AuthGuard('discord') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    // 여기에 추가적인 인증 로직을 적용할 수 있습니다.
    super.canActivate(context);
    console.log(context.switchToHttp().getRequest());
    return true;
  }
}
