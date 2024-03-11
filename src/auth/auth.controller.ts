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
  async googleLoginCallback(@Req() req, @Res() res): Promise<void> {
    const access_token = req.user;
    console.log(access_token);
    // if (access_token)
    //   res.redirect(
    //     'http://localhost:3000/main' + `/${access_token?.access_token}`,
    //   );
    // else res.redirect('http://localhost:3000/board1');
    console.log('리다이렉트시키기');
    res.cookie('Authorization', `Bearer ${access_token?.access_token}`, {
      //path: '/',
      domain: '13.209.210.215',
      sameSite: 'none', // cross-site에서도 전송
    });
    res.header('Authorization', `Bearer ${access_token?.access_token}`);
    // res.json(access_token.payload);
    res.redirect('http://localhost:3000');
    //return ;
  }

  @Delete('logout')
  @UseGuards(AccessTokenGuard)
  DeleteToken(@Req() req) {
    const { discord_id } = req.user;
    this.authService.deleteRefreshToken(discord_id);
  }
}
