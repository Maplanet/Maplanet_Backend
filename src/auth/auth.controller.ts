import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from './guard/bearer-token.guard';
import { ConfigService } from '@nestjs/config';
import { url } from 'inspector';

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

    // res.cookie('Authorization', `Bearer ${access_token?.access_token}`, {
    //   maxAge: 3600000,
    //   domain: 'maplanet.store',
    //   path: '/',
    //   sameSite: 'none', // cross-site에서도 전송
    // });
    console.log(userInfo);
    res
      .cookie('Authorization', `Bearer ${userInfo?.access_token}`, {
        maxAge: 604800000, // 쿠키의 만료 날짜를 7일 후로 설정
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        // domain: '.maplanet-front.vercel.app',
        domain: '.maplanet.store',
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
          // domain: '.maplanet-front.vercel.app',
          domain: '.maplanet.store',
        },
      )
      .redirect(HttpStatus.MOVED_PERMANENTLY, 'https://www.maplanet.store/');
  }

  @Delete('logout')
  @UseGuards(AccessTokenGuard)
  async DeleteToken(@Req() req, @Res() res) {
    try{
    const { discord_id } = req.user;
    await this.authService.deleteRefreshToken(discord_id);
    res
      .clearCookie('Authorization', {
        maxAge: 604800000,
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        // domain: '.maplanet-front.vercel.app',
        domain: '.maplanet.store',
        // domain: 'localhost:3000',
      })
      .clearCookie('userInfo', {
        maxAge: 604800000,
        path: '/',
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        // domain: '.maplanet-front.vercel.app',
        domain: '.maplanet.store',
        // domain: 'localhost:3000',
      });
    return '삭제완료';
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '로그아웃 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  @Get('test')
  test(@Res() res) {
    const url = 'https://www.maplanet.store/auth/discord';
    this.authService.redirectDiscordUrl(res, url);
  }
}
