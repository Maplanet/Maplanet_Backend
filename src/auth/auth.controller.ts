import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  // @Redirect('http://localhost:3000', 302)
  async getUserFromDiscordLogin(@Req() req): Promise<any> {
    console.log(req.user);
    return req.user;
  }

  @Get('redirect')
  @UseGuards(AuthGuard('discord'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
