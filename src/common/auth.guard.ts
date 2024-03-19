import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  //
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const discordId: string = request.headers['Authorization'];

    console.log(request.headers);
    return;
    const checkDiscordId = await this.usersService.checkUser(discordId);
    //checkDiscordId에는 디스코드로그인을 전에 했으면 디스코드 아이디가 들어오고
    //아니면 아무것도없어서 예외처리
    if (!checkDiscordId)
      throw new UnauthorizedException('검증되지 않은 사용자');

    //7489654321358
    request.discordId;
    return true;
  }
}
