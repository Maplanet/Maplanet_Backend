import { Controller, Get, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UsersService } from './users.service';
// import { DiscordAuthGuard } from '../auth/discord-auth.guard'

interface IData {
  access_token: string;
  refreshToken: string;
  discordImage: string;
}

@ApiTags('USERS')
@Controller('/discord')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get('/login')
  // @UseGuards(DiscordAuthGuard)
  @ApiOperation({
    summary: '디스코드 로그인',
    description: '디스코드 로그인',
  })
  @Redirect('http://localhost:3000', 301)
  async discordLogin(@Query('code') code: string):Promise<IData> {
    const tokenResponse = await this.usersService.discordLogin(code);
    //로그인한 순간 클라이언트로 토큰,아바타url반환
    return tokenResponse;
  }
}