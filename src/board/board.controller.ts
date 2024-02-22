import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/auth.guard';
import { CreateBoardDto } from './dto/create-board.dto';

@ApiTags('BOARD')
@Controller('board1')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/')
  @ApiOperation({
    summary: '잠쩔 게시글 전체 조회',
    description: '잠수 쩔 해주는 유저가 올린 게시글 전체 조회',
  })
  @ApiResponse({ status: 200, description: '잠쩔 게시글 전체 조회' })
  async boardInfo(@Query('page') page: number): Promise<any> {
    const getBoardInfo = await this.boardService.boardInfo(page);
    return getBoardInfo;
  }

  @Get('/')
  @ApiOperation({
    summary: '잠쩔 게시글 검색 조회',
    description: '잠수 쩔 해주는 유저가 올린 게시글을 검색해서 전체 조회',
  })
  @ApiResponse({ status: 200, description: '잠쩔 게시글 전체 조회' })
  async boardSearchInfo(
    @Query('page') page: number,
    @Query('search') search: any,
  ): Promise<any> {
    const getBoardSearchInfo = await this.boardService.boardSearchInfo(
      page,
      search,
    );
    return getBoardSearchInfo;
  }

  @Post('/post')

  // @UseGuards(AuthGuard)
  async postBoard(
    @Body() createBoardDto: CreateBoardDto,
    @Req() request: Request,
  ): Promise<any> {
    // const userId = request['user'].userId;
    const getBoardInfo = await this.boardService.postBoard(
      createBoardDto,
      //userId
    );
    return getBoardInfo;
  }
}
