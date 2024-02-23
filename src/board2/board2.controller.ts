import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
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

  @Get('/search')
  @ApiOperation({
    summary: '겹사 게시글 검색 조회',
    description: '겹사 의뢰 한 유저가 올린 게시글 검색해서 전체 조회'
  })
  @ApiResponse({ status: 200, description: '잠쩔 게시글 전체 조회' })
  async board2SearchInfo(@Query('page') page: number, @Query('search') search: any): Promise<any> {
    const getBoard2SearchInfo = await this.board2Service.board2SearchInfo(page, search)
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
}
