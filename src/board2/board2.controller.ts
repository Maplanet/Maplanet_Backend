import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { Board2Service } from './board2.service';
import { CreateBoard2Dto } from './dto/create-board2.dto';

@ApiTags('BOARD2')
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
    const getBoard2Info = await this.board2Service.board2Info(page);
    const getBoard2Count = await this.board2Service.board2PageCount();
    return { board2Data:
      getBoard2Info,
      getBoard2Count
    }
  }

  @Get('/detail/:board2_id')
  @ApiOperation({
    summary: '겹사 게시글 상세조회',
    description: '겹사 해주는 유저가 올린 게시글 상세조회',
  })
  @ApiResponse({ status: 200, description: '겹사 게시글 상세조회' })
  async board2DetailInfo(@Param('board2_id') board2_id: number): Promise<any> {
    const getBoard2Info = await this.board2Service.board2DetailInfo(board2_id);
    return getBoard2Info;
  }

  @Get('/search')
  @ApiOperation({
    summary: '겹사 게시글 검색 조회',
    description: '겹사 의뢰 한 유저가 올린 게시글 검색해서 전체 조회'
  })
  @ApiResponse({ status: 200, description: '겹사 게시글 검색해서 전체 조회' })
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

  @ApiOperation({
    summary: '겹사 게시글 등록',
    description: '겹사 의뢰를 올릴 유저가 게시글 등록하기',
  })
  @ApiResponse({ status: 201, description: 'meso, report_kind, titl, request_nickname, place_theif_nickname 등록' })
  @UseGuards(AccessTokenGuard)
  @Post('/post')
  async postBoard2(@Body() createBoard2Dto: CreateBoard2Dto, @Req() req): Promise<any> {
    const user = req.user;
    const getBoard2Info = await this.board2Service.postBoard2(createBoard2Dto, user)
    return getBoard2Info
  }

  @ApiOperation({
    summary: '겹사 게시글 완료',
    description: '겹사 의뢰가 끝난 유저가 완료하기 누르기',
  })
  @ApiResponse({ status: 201, description: '겹사 완료됨' })
  @UseGuards(AccessTokenGuard)
  @Patch('/complete/:board2_id')
  async completeBoard2(
    @Param('board2_id') board2_id: number, 
    @Req() req,
  ): Promise<any> {
    const { user_id } = req.user;
    return await this.board2Service.completeBoard2(board2_id, user_id);
  }
}
