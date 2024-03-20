import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from './guard/bearer-token.guard';
import { ConfigService } from '@nestjs/config';
import { send } from 'process';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async getUserFromDiscordLogin(@Req() req, @Res() res): Promise<any> {}

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async googleLoginCallback(
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<void> {
    const userInfo = req.user;
    res
      .cookie('Authorization', `Bearer ${userInfo?.access_token}`, {
        maxAge: this.configService.get<number>('cookieExpires'),
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        domain: this.configService.get<string>('cookieDomain'),
      })
      .cookie(
        'userInfo',
        `${userInfo.payload.global_name},${userInfo.payload.avatar},${userInfo.payload.user_id}`,
        {
          maxAge: this.configService.get<number>('cookieExpires'),
          path: '/',
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          domain: this.configService.get<string>('cookieDomain'),
        },
      )
      .redirect(
        HttpStatus.MOVED_PERMANENTLY,
        this.configService.get<string>('loginRedirectURL'),
      );
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  async DeleteToken(@Req() req, @Res({ passthrough: true }) res) {
    const { discord_id } = req.user;
    await this.authService.deleteRefreshToken(discord_id);
    return { msg: '삭제완료' };
  }
}
