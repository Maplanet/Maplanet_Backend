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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  @Redirect('http://localhost:3000', 302)
  async getUserFromDiscordLogin(@Req() req, @Res() res): Promise<any> {
    const { access_token } = req.user;

    // if (!existUser) {
    //   await this.usersServiece.saveUser(data);
    // }
    //return this.authService.findUserFromDiscordId(data.id);
    //지금할거 : JWT에 accesstoken 생성, 필요한 정보 넣고 응답헤더로 반환
    //리프레쉬 토큰은 redis db에 넣기

    const access_token_verify = this.authService.verifyToken(access_token);
    console.log(access_token_verify);
    res.header('Authorization', `Bearer ${access_token}`);
    res.cookie('cookieName', 'cookieValue', { maxAge: 900000, httpOnly: true });
    return '완료';
  }

  @Get('redirect')
  @UseGuards(AuthGuard('discord'))
  googleAuthRedirect(@Req() req) {
    //   return this.authService.googleLogin(req);
  }

  @Delete('logout')
  @UseGuards()
  DeleteToken() {}
}
