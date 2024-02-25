import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { Strategy, Verifycheck } from 'passport-oauth2';
import { stringify } from 'querystring';
import { UsersService } from 'src/users/users.service';
import { encrypt } from './encrypt';
import { VerifyCallback } from 'jsonwebtoken';

// change these to be your Discord client ID and secret
const clientID = '1207737873063739452';
const clientSecret = 'ZaxXr7J7d3P4W3-RmuZO7HYbLgdmpMCS';
const callbackURL = 'http://localhost:3000/auth/discord';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private readonly usersServiece: UsersService,
    private authService: AuthService,
    private http: HttpService,
  ) {
    super({
      authorizationURL: `https://discordapp.com/api/oauth2/authorize?${stringify(
        {
          client_id: clientID,
          redirect_uri: callbackURL,
          response_type: 'code',
          scope: 'identify',
        },
      )}`,
      tokenURL: 'https://discordapp.com/api/oauth2/token',
      scope: 'identify',
      clientID,
      clientSecret,
      callbackURL,
    });
  }

  async validate(accessToken: string, refreshToken: string): Promise<any> {
    const { data } = await this.http
      .get('https://discordapp.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();

    const access_token = await this.authService.validateOAuth2(data);
    // if (!existUser) {
    //   await this.usersServiece.saveUser(data);
    // }
    //return this.authService.findUserFromDiscordId(data.id);
    //지금할거 : JWT에 accesstoken 생성, 필요한 정보 넣고 응답헤더로 반환
    //리프레쉬 토큰은 redis db에 넣기
    return access_token;
  }
}
