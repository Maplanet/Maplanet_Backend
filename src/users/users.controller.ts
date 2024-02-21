import {
  Controller,
  Get,
  Header,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  constructor(private readonly usersService: UsersService) {}

  // @Get('/login')
  // // @UseGuards(DiscordAuthGuard)
  // @ApiOperation({
  //   summary: '디스코드 로그인',
  //   description: '디스코드 로그인',
  // })
  // @Redirect('http://localhost:3000', 301)
  // async discordLogin(@Query('code') code: string ):Promise<any> {
  //   const tokenResponse = await this.usersService.discordLogin(code);
  //   //console.log(tokenResponse.accessToken)
  //   // const tokenBearer = `bearer ${tokenResponse.accessToken}`

  //   //로그인한 순간 클라이언트로 토큰,아바타url반환
  //   // const accessToken = tokenBearer.split(' ')[1]
  //   // res.header('Authorization', `bearer ${accessToken}`)
  //   // console.log(accessToken)

  //   console.log(tokenResponse)
  //   return tokenResponse
  // }
}
