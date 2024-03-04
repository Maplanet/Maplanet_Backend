import {
  Controller,
  Get,
  Header,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { UsersService } from './users.service';

interface IData {
  access_token: string;
  refreshToken: string;
  discordImage: string;
}

@ApiTags('USERS')
@Controller('/')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '유저 프로필 쩔',
    description: '유저의 프로필을 확인할 수 있음',
  })
  @ApiResponse({ status: 200, description: '유저 정보, 유저가 올린 쩔 게시글 정보' })
  @Get('/userprofile/board1/:user_id')
  async usersProfileBoard1 (@Query('page') page: number, @Param('user_id') user_id: number): Promise<any> {
    try{
      const userProfileBoard1: any = {}
      const userProfile = await this.usersService.userProfile(user_id);
      userProfileBoard1.userProfile = userProfile
      
      const board1Profile = await this.usersService.board1Profile(page, user_id);
      userProfileBoard1.board1Profile = board1Profile

      const userPageCount = await this.usersService.userPageCountBoard1(user_id);
      userProfileBoard1.userPageCount = userPageCount

      return userProfileBoard1
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '유저 프로필 쩔 게시글 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  @ApiOperation({
    summary: '유저 프로필 겹사',
    description: '유저의 프로필을 확인할 수 있음',
  })
  @ApiResponse({ status: 200, description: '유저 정보, 유저가 올린 겹사 게시글 정보' })
  @Get('/userprofile/board2/:user_id')
  async usersProfileBoard2 (@Query('page') page: number, @Param('user_id') user_id: number): Promise<any> {
    try {
      const userProfileBoard2: any = {}
      const userProfile = await this.usersService.userProfile(user_id);
      userProfileBoard2.userProfile = userProfile
      
      const board2Profile = await this.usersService.board2Profile(page, user_id);
      userProfileBoard2.board2Profile = board2Profile

      const userPageCount = await this.usersService.userPageCountBoard2(user_id);
      userProfileBoard2.userPageCount = userPageCount

      return userProfileBoard2
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '유저 프로필 겹사 게시글 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  @ApiOperation({
    summary: '내 프로필 쩔',
    description: '내 프로필을 확인할 수 있음',
  })
  @ApiResponse({ status: 200, description: '내 정보, 내가 올린 쩔 게시글 정보' })
  @UseGuards(AccessTokenGuard)
  @Get('/myprofile/board1')
  async myProfileBoard1 (@Query('page') page: number, @Req() req): Promise<any> {
    try{
      const {user_id} = req.user
      const myProfileBoard1: any = {}
      const myProfile = await this.usersService.userProfile(user_id);
      myProfileBoard1.myProfile = myProfile
      
      const board1Profile = await this.usersService.board1Profile(page, user_id);
      myProfileBoard1.board1Profile = board1Profile 

      const userPageCount = await this.usersService.userPageCountBoard1(user_id);
      myProfileBoard1.userPageCount = userPageCount
    
      return myProfileBoard1
    } catch (error) {
      throw new HttpException(
        {
          status: 401,
          error: {
            message: '내 프로필 쩔 게시글 조회 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  }

  @ApiOperation({
    summary: '내 프로필 겹사',
    description: '내 프로필을 확인할 수 있음',
  })
  @ApiResponse({ status: 200, description: '내 정보, 내가 올린 겹사 게시글 정보' })  @UseGuards(AccessTokenGuard)
  @Get('/myprofile/board2')
  async myProfileBoard2 (@Query('page') page: number, @Req() req): Promise<any> {
    try{
      const {user_id} = req.user
      const myProfileBoard2: any = {}
      const myProfile = await this.usersService.userProfile(user_id);
      myProfileBoard2.myProfile = myProfile
      
      const board2Profile = await this.usersService.board2Profile(page, user_id);
      myProfileBoard2.board2Profile = board2Profile 

      const userPageCount = await this.usersService.userPageCountBoard2(user_id);
      myProfileBoard2.userPageCount = userPageCount
    
      return myProfileBoard2
    } catch (error) {
      throw new HttpException(
        {
          status: 401,
          error: {
            message: '내 프로필 겹사 게시글 조회 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  }

}
