import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CreatePartyDto } from './dto/create-party.dto';
import { PartyService } from './party.service';

@Controller('board4')
export class PartyController {
    constructor(private readonly partyService: PartyService) {}

    @Get('/')
    @ApiOperation({
      summary: '파티모집 게시글 전체 조회',
      description: '파티모집 하는 유저가 올린 게시글 전체 조회',
    })
    @ApiResponse({ status: 200, description: '파티모집 게시글 전체 조회' })
    async partyInfo(@Query('page') page: number): Promise<any> {
      const getPartyInfo = await this.partyService.partyInfo(page);
      const getPartyCount = await this.partyService.partyPageCount();
      return { board1Data:
        getPartyInfo,
        totalCount: getPartyCount
      }
    }
  
    @Get('/detail/:board4_id')
    @ApiOperation({
      summary: '파티모집 게시글 상세조회',
      description: '파티모집 하는 유저가 올린 게시글 상세조회',
    })
    @ApiResponse({ status: 200, description: '파티모집 게시글 전체 조회' })
    async partyDetailInfo(@Param('board4_id') board4_id: number): Promise<any> {
      const getPartyInfo = await this.partyService.partyDetailInfo(board4_id);
      return getPartyInfo;
    }
  
    @Get('/search')
    @ApiOperation({
      summary: '쩔 게시글 검색 조회',
      description: '쩔 해주는 유저가 올린 게시글을 검색해서 전체 조회',
    })
    @ApiResponse({ status: 200, description: '쩔 게시글 전체 조회' })
    @ApiQuery({ name: 'searchTitle', required: false, type: String })
    @ApiQuery({ name: 'searchHuntingGround', required: false, type: String })
    @ApiQuery({ name: 'searchProgressTime', required: false, type: String })
    @ApiQuery({ name: 'searchDiscordName', required: false, type: String })
    async boardSearchInfo(
      @Query('page') page?: number,
      @Query('searchTitle') searchTitle?: string,
      @Query('searchHuntingGround') searchHuntingGround?: string,
      @Query('searchProgressTime') searchProgressTime?: number,
      @Query('searchDiscordName') searchDiscordName?: string,
    ): Promise<any> {
      const { search4Data, totalCount } = await this.partyService.partySearchInfo(
        page,
        searchTitle,
        searchHuntingGround,
        searchProgressTime,
        searchDiscordName,
      );
      return { search4Data, totalCount };
    }
  
    @ApiOperation({
      summary: '파티모집 게시글 등록',
      description: '파티모집 하는 유저가 올리 게시글 등록하기',
    })
    @ApiResponse({ status: 201, description: '파티모집 게시글 등록' })
    @UseGuards(AccessTokenGuard)
    @Post('/post')
    async postParty(
      @Body() createPartyDto: CreatePartyDto,
      @Req() req,
    ): Promise<any> {
      const user = req.user;
      const getPartyInfo = await this.partyService.postParty(
        createPartyDto,
        user
      );
      return getPartyInfo;
    }
  
    @ApiOperation({
      summary: '파티모집 게시글 완료',
      description: '파티모집이 끝난 게시글을 올린 유저가 완료하기 누르기',
    })
    @ApiResponse({ status: 201, description: '파티모집 완료됨' })
    @UseGuards(AccessTokenGuard)
    @Patch('/complete/:board4_id')
    async completeParty(
      @Param('board4_id') board4_id: number, 
      @Req() req,
    ): Promise<any> {
      const {user_id} = req.user;
      return await this.partyService.completeParty(board4_id, user_id);
    }
}
