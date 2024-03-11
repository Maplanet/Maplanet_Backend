import {
  Controller,
  Delete,
  Get,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from './guard/bearer-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    const access_token = req.user;

    res.cookie('Authorization', `Bearer ${access_token?.access_token}`, {
      maxAge: 3600000,
      domain: '13.209.210.215',
      path: '/',
      sameSite: 'none', // cross-site에서도 전송
      secure: true, // HTTPS 환경에서만 쿠키 전송
    });

    res.redirect('http://13.209.210.215:3000/main');
  }

  @Delete('logout')
  @UseGuards(AccessTokenGuard)
  DeleteToken(@Req() req) {
    const { discord_id } = req.user;
    this.authService.deleteRefreshToken(discord_id);
  }
}
