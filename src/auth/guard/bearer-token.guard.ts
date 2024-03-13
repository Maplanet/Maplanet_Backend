import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersServcie: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const Bearertoken = req.cookies['Authorization'];

    const [type, rawToken] = Bearertoken.split(' ') ?? [];

    //const user = await this.usersServcie.getUserByEmail(result.email);
    //토큰은 없는데 유저정보는 있을때
    //토큰도 없고 가입한 유저정보도 없을때
    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다');
    }

    const token = this.authService.extractTokenFormHeader(type, rawToken);

    const result = await this.authService.verifyToken(token);

    //const user = await this.usersServcie.getUserByEmail(result.email);

    //req.user = user;
    req.token = token;
    req.user = result;
    //req.tokenType = result.Type;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    // if (req.tokenType !== 'access') {
    //   throw new UnauthorizedException('Access Token이 아닙니다.');
    // }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //super는 하위 클래스에서 상위클래스의 메서드를 호출할떄 사용
    //AccesstokenGuard 클래스의 canActive 메서드에서 super.canActivate(context)를 호출
    //=> BearerTokenGuard클래스의 canActivate메서드를 호출함
    //AccessTokenGuard는 BearerTokenGuard의 canActivate 로직을 사용하면서 추가적인 동작을 정의가능
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.tokenType !== 'refresh') {
      throw new UnauthorizedException('Refresh Token이 아닙니다.');
    }

    return true;
  }
}
