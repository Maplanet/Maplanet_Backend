import {
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
// import { DiscordAuthGuard } from '../auth/discord-auth.guard'

interface IData {
  access_token: string;
  refreshToken: string;
  discordImage: string;
}

@ApiTags('USERS')
@Controller('/')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/userprofile/board1/:user_id')
  async usersProfileBoard1 (@Query('page') page: number, @Param('user_id') user_id: number): Promise<any> {
    const userProfileBoard1: any = {}
    const userProfile = await this.usersService.userProfile(user_id);
    userProfileBoard1.userProfile = userProfile
    
    const board1Profile = await this.usersService.board1Profile(page, user_id);
    userProfileBoard1.board1Profile = board1Profile

    return userProfileBoard1
  }

  @Get('/userprofile/board2/:user_id')
  async usersProfileBoard2 (@Query('page') page: number, @Param('user_id') user_id: number): Promise<any> {
    const userProfileBoard2: any = {}
    const userProfile = await this.usersService.userProfile(user_id);
    userProfileBoard2.userProfile = userProfile
    
    const board2Profile = await this.usersService.board2Profile(page, user_id);
    userProfileBoard2.board2Profile = board2Profile

    return userProfileBoard2
  }

  // 내 쩔 프로필 조회
  // @UseGuards(AuthGuard)
  // @Get('/myprofile/board1')
  // async myProfileBoard1 (@Query('page') page: number): Promise<any> {
  //   const myProfileBoard1: any = {}
  //   const myProfile = await this.usersService.userProfile(user_id);
  //   myProfileBoard1.myProfile = myProfile
    
  //   const board1Profile = await this.usersService.board1Profile(page, user_id);
  //   myProfileBoard1.board1Profile = board1Profile 
  
  //   return myProfileBoard1
  // }

  //내 겹사 프로필 조회
  // @UseGuards(AuthGuard)
  // @Get('/myprofile/board1')
  // async myProfileBoard1 (@Query('page') page: number): Promise<any> {
  //   const myProfileBoard2: any = {}
  //   const myProfile = await this.usersService.userProfile(user_id);
  //   myProfileBoard2.myProfile = myProfile
    
  //   const board1Profile = await this.usersService.board2Profile(page, user_id);
  //   myProfileBoard2.board1Profile = board1Profile 
  
  //   return myProfileBoard2
  // }

}
