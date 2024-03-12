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
      userProfileBoard1.totalCount = userPageCount

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
      userProfileBoard2.totalCount = userPageCount

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
    summary: '유저 프로필 나무꾼',
    description: '유저의 프로필을 확인할 수 있음',
  })
  @ApiResponse({ status: 200, description: '유저 정보, 유저가 올린 나무꾼 게시글 정보' })
  @Get('/userprofile/board3/:user_id')
  async usersProfileBoard3 (@Query('page') page: number, @Param('user_id') user_id: number): Promise<any> {
    try {
      const userProfileBoard3: any = {}
      const userProfile = await this.usersService.userProfile(user_id);
      userProfileBoard3.userProfile = userProfile
      
      const board3Profile = await this.usersService.board3Profile(page, user_id);
      userProfileBoard3.board3Profile = board3Profile

      const userPageCount = await this.usersService.userPageCountBoard3(user_id);
      userProfileBoard3.totalCount = userPageCount

      return userProfileBoard3
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '유저 프로필 나무꾼 게시글 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  @ApiOperation({
    summary: '유저 프로필 파티모집',
    description: '유저의 프로필을 확인할 수 있음',
  })
  @ApiResponse({ status: 200, description: '유저 정보, 유저가 올린 파티모집 게시글 정보' })
  @Get('/userprofile/board4/:user_id')
  async usersProfileBoard4 (@Query('page') page: number, @Param('user_id') user_id: number): Promise<any> {
    try {
      const usersProfileBoard4: any = {}
      const userProfile = await this.usersService.userProfile(user_id);
      usersProfileBoard4.userProfile = userProfile
      
      const board4Profile = await this.usersService.board4Profile(page, user_id);
      usersProfileBoard4.board4Profile = board4Profile

      const userPageCount = await this.usersService.userPageCountBoard4(user_id);
      usersProfileBoard4.totalCount = userPageCount

      return usersProfileBoard4
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '유저 프로필 파티모집 게시글 조회 에러',
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
      myProfileBoard1.totalCount = userPageCount
    
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
  @ApiResponse({ status: 200, description: '내 정보, 내가 올린 겹사 게시글 정보' })  
  @UseGuards(AccessTokenGuard)
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
      myProfileBoard2.totalCount = userPageCount
    
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

  @ApiOperation({
    summary: '내 프로필 나무꾼',
    description: '내 프로필을 확인할 수 있음',
  })
  @ApiResponse({ status: 200, description: '내 정보, 내가 올린 나무꾼 게시글 정보' })  
  @UseGuards(AccessTokenGuard)
  @Get('/myprofile/board3')
  async myProfileBoard3 (@Query('page') page: number, @Req() req): Promise<any> {
    try{
      const {user_id} = req.user
      const myProfileBoard3: any = {}
      const myProfile = await this.usersService.userProfile(user_id);
      myProfileBoard3.myProfile = myProfile
      
      const board3Profile = await this.usersService.board3Profile(page, user_id);
      myProfileBoard3.board3Profile = board3Profile 

      const userPageCount = await this.usersService.userPageCountBoard3(user_id);
      myProfileBoard3.totalCount = userPageCount
    
      return myProfileBoard3
    } catch (error) {
      throw new HttpException(
        {
          status: 401,
          error: {
            message: '내 프로필 나무꾼 게시글 조회 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  }

  @ApiOperation({
    summary: '내 프로필 파티모집',
    description: '내 프로필을 확인할 수 있음',
  })
  @ApiResponse({ status: 200, description: '내 정보, 내가 올린 파티모집 게시글 정보' })  
  @UseGuards(AccessTokenGuard)
  @Get('/myprofile/board4')
  async myProfileBoard4 (@Query('page') page: number, @Req() req): Promise<any> {
    try{
      const {user_id} = req.user
      const myProfileBoard4: any = {}
      const myProfile = await this.usersService.userProfile(user_id);
      myProfileBoard4.myProfile = myProfile
      
      const board4Profile = await this.usersService.board4Profile(page, user_id);
      myProfileBoard4.board4Profile = board4Profile 

      const userPageCount = await this.usersService.userPageCountBoard4(user_id);
      myProfileBoard4.totalCount = userPageCount
    
      return myProfileBoard4
    } catch (error) {
      throw new HttpException(
        {
          status: 401,
          error: {
            message: '내 프로필 파티모집 게시글 조회 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  }
}
