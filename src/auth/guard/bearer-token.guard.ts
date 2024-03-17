import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersServcie: UsersService,
    private readonly httpService: HttpService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const Bearertoken1 = req.cookies['Authorization'];
    const Bearertoken2 = req.cookies['authorization'];
    const Bearertoken3 = req.headers['authorization'];

    //1. 토큰 입력
    const [type, rawToken] = Bearertoken3.split(' ') ?? Bearertoken2.split(' ');

    const token = this.authService.extractTokenFormHeader(type, rawToken);

    //2. 토큰 검증
    console.log(token);
    const result = await this.authService.verifyToken(token, res);

    console.log(result);
    if (result.newAccessToken) {
      req.token = result.newAccessToken;
      req.user = result.userInfo;
      res.cookie('Authorization', `Bearer ${result.newAccessToken}`, {
        maxAge: 3600000,
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        // domain: '.maplanet-front.vercel.app',
        domain: '.maplanet.store',
      }); // maxAge는 밀리초 단위로 설정됩니다.
    } else {
      req.token = token;
      req.user = result;
    }

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
