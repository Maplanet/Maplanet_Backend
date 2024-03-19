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
  //@Redirect('http://localhost:3000', 302)
  async getUserFromDiscordLogin(@Req() req, @Res() res): Promise<any> {
    //const access_token = req.user;
    //res.cookie('Authorization', `Bearer ${access_token?.access_token}`);
    //res.header('Authorization', `Bearer ${access_token?.access_token}`);
    // res.redirect('http://localhost:3000');
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async googleLoginCallback(
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<void> {
    const userInfo = req.user;
    console.log(userInfo);
    res
      .cookie('Authorization', `Bearer ${userInfo?.access_token}`, {
        maxAge: 604800000,
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        domain: 'maplanet.store',
      })
      .cookie(
        'userInfo',
        `${userInfo.payload.global_name},${userInfo.payload.avatar}`,
        {
          maxAge: 604800000,
          path: '/',
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          domain: 'maplanet.store',
        },
      )
      .redirect(HttpStatus.MOVED_PERMANENTLY, 'https://www.maplanet.store/');
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  async DeleteToken(@Req() req, @Res({ passthrough: true }) res) {
    const userInfo = req.user;
    const access_token: string = req.token;
    await this.authService.deleteRefreshToken(userInfo.discord_id);

    res
      .clearCookie('Authorization', {
        maxAge: 0,
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        domain: 'maplanet.store',
      })
      .clearCookie('userInfo', {
        maxAge: 0,
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        domain: 'maplanet.store',
      });
    // .redirect(HttpStatus.MOVED_PERMANENTLY, 'https://www.maplanet.store/');
  }

  @Get('test')
  test(@Res() res) {
    const url = 'https://www.maplanet.store/auth/discord';
    this.authService.redirectDiscordUrl(res, url);
  }
}
