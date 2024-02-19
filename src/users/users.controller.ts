import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
// import { DiscordAuthGuard } from '../auth/discord-auth.guard'

@ApiTags('USERS')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get('/discord/login')
  // @UseGuards(DiscordAuthGuard)
  // @ApiOperation({
  //   summary: '디스코드 로그인',
  //   description: '디스코드 로그인'
  // })
  // async discordLogin(@Req() req: Request) {
    
  // }

  // @Get('discord/callback')
  // @UseGuards(DiscordAuthGuard)
  // async discordLoginCallback(@Req() req: Request, @Res() res: Response) {
  //   res.redirect('/')
  // }
}
