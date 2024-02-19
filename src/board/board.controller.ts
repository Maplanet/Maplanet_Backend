import { Controller, Get, Query } from '@nestjs/common';
import { BoardService } from './board.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('BOARD')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/')
  @ApiOperation({
    summary: '잠쩔 게시글 전체 조회',
    description: '잠수 쩔 해주는 유저가 올린 게시글 전체 조회'
  })
  @ApiResponse({ status: 200, description: '잠쩔 게시글 전체 조회' })
  async boardInfo(@Query('page') page: number): Promise<any> {
    const getBoardInfo = await this.boardService.boardInfo(page)
    return getBoardInfo
  }

}
