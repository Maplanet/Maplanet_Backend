import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { Strategy, Verifycheck } from 'passport-oauth2';
import { stringify } from 'querystring';
import { VerifyCallback } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private authService: AuthService,
    private http: HttpService,
    public configService: ConfigService,
  ) {
    super({
      authorizationURL: `https://discordapp.com/api/oauth2/authorize?${stringify(
        {
          client_id: configService.get('clientID'),
          redirect_uri: configService.get('callbackURL'),
          response_type: 'code',
          scope: 'identify email',
        },
      )}`,
      tokenURL: 'https://discordapp.com/api/oauth2/token',
      scope: 'identify email',
      clientID: configService.get('clientID'),
      clientSecret: configService.get('clientSecret'),
      callbackURL: configService.get('callbackURL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
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
