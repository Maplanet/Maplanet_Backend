import { Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UsersService } from './users.service';
// import { DiscordAuthGuard } from '../auth/discord-auth.guard'

@ApiTags('USERS')
@Controller('/discord')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get('/login')
  @ApiOperation({
    summary: '디스코드 로그인',
    description: '디스코드 로그인',
  })
  async discordLogin(@Query('code') code: any):Promise<void> {
    const tokenResponse = await this.usersService.discordLogin(code);
    return tokenResponse;
  }
}