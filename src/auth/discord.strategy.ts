import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { Strategy, Verifycheck } from 'passport-oauth2';
import { stringify } from 'querystring';
import { UsersService } from 'src/users/users.service';
import { VerifyCallback } from 'jsonwebtoken';

// change these to be your Discord client ID and secret
const clientID = '1207737873063739452';
const clientSecret = 'ZaxXr7J7d3P4W3-RmuZO7HYbLgdmpMCS';
//const callbackURL = 'http://localhost:3000/auth/discord/callback';
const callbackURL = 'http://13.209.210.215:3000/auth/discord/callback';

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
          scope: 'identify email',
        },
      )}`,
      tokenURL: 'https://discordapp.com/api/oauth2/token',
      scope: 'identify email',
      clientID,
      clientSecret,
      callbackURL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // const encryptedAccessToken = encrypt(accessToken);
    // const encryptedRefreshToken = encrypt(refreshToken);
    const { data } = await this.http
      .get('https://discordapp.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .toPromise();

    data.access_token = accessToken;
    data.refresh_token = refreshToken;

    const result = await this.authService.validateOAuth2(data);
    return done(null, result);
  }
}
