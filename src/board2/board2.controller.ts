import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Board2Service } from './board2.service';
import { CreateBoard2Dto } from './dto/create-board2.dto';

@Controller('board2')
export class Board2Controller {
  constructor(private readonly board2Service: Board2Service) {}

  @Get('/')
  @ApiOperation({
    summary: '겹사 게시글 전체 조회',
    description: '겹사 의뢰 한 유저가 올린 게시글 전체 조회'
  })
  @ApiResponse({ status: 200, description: '잠쩔 게시글 전체 조회' })
  async board2Info(@Query('page') page: number): Promise<any> {
    const getBoard2Info = await this.board2Service.board2Info(page)
    return getBoard2Info
  }

  @Get('/detail/:board2_id')
  @ApiOperation({
    summary: '겹사 게시글 상세조회',
    description: '겹사 해주는 유저가 올린 게시글 상세조회',
  })
  @ApiResponse({ status: 200, description: '겹사 게시글 전체 조회' })
  async board2DetailInfo(@Param('board2_id') board2_id: number): Promise<any> {
    const getBoard2Info = await this.board2Service.board2DetailInfo(board2_id);
    return getBoard2Info;
  }

  @Get('/search')
  @ApiOperation({
    summary: '겹사 게시글 검색 조회',
    description: '겹사 의뢰 한 유저가 올린 게시글 검색해서 전체 조회'
  })
  @ApiResponse({ status: 200, description: '잠쩔 게시글 전체 조회' })
  @ApiQuery({ name: 'searchMeso', required: false, type: Number })
  @ApiQuery({ name: 'searchReportKind', required: false, type: String })
  @ApiQuery({ name: 'searchTitle', required: false, type: String })
  @ApiQuery({ name: 'searchRequestNickname', required: false, type: String })
  @ApiQuery({ name: 'searchPlaceTheifNickname', required: false, type: String })
  @ApiQuery({ name: 'searchDiscordName', required: false, type: String })
  async board2SearchInfo(
    @Query('page') page: number, 
    @Query('searchMeso') searchMeso: number,
    @Query('searchReportKind') searchReportKind: string,
    @Query('searchTitle') searchTitle: string,
    @Query('searchRequestNickname') searchRequestNickname: string,
    @Query('searchPlaceTheifNickname') searchPlaceTheifNickname: string,
    @Query('searchDiscordName') searchDiscordName: string,

    ): Promise<any> {
    const getBoard2SearchInfo = await this.board2Service.board2SearchInfo(
      page, 
      searchMeso,
      searchReportKind,
      searchTitle,
      searchRequestNickname,
      searchPlaceTheifNickname,
      searchDiscordName
      )
    return getBoard2SearchInfo
  }

  @Post('/post')
  // @UseGuards(AuthGuard)
  async postBoard2(@Body() createBoard2Dto: CreateBoard2Dto, @Req() request: Request): Promise<any> {
    // const userId = request['user'].userId;
    const getBoard2Info = await this.board2Service.postBoard2(createBoard2Dto, 
      //userId
      )
    return getBoard2Info
  }

  // @UseGuards(AuthGuard)
  @Patch('/complete/:board2_id')
  async completeBoard2(
    @Param('board2_id') board2_id: number, 
    @Req() request: Request,
  ): Promise<any> {
    // const discordId = request.headers['discord_id'];
    const discordId = '11111111'
    // console.log(discordId)
    // const userId = request['user'].userId;
    return await this.board2Service.completeBoard2(board2_id, discordId);
  }
}
