import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  @Redirect('http://localhost:3000', 302)
  async getUserFromDiscordLogin(@Req() req, @Res() response): Promise<any> {
    console.log('유저정보?', req.user);
    //토큰 클라이언트 응답바디에 전달
    const { accessToken, refreshToken } = req.user;
    return [accessToken, refreshToken];
    //    response.redirect('http://localhost:3000', 302);
  }
}
