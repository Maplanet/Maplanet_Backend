import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { Strategy, Verifycheck } from 'passport-oauth2';
import { stringify } from 'querystring';
import { VerifyCallback } from 'jsonwebtoken';

const clientID = '1207737873063739452';
const clientSecret = 'ZaxXr7J7d3P4W3-RmuZO7HYbLgdmpMCS';
const callbackURL = 'https://maplanet.store/auth/discord/callback';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
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
