import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/auth.guard';
import { CreateBoardDto } from './dto/create-board.dto';
import { LoggingInterceptor } from 'src/logger/logger.interceptor';

@ApiTags('BOARD')
@Controller('board1')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('/')
  @ApiOperation({
    summary: '쩔 게시글 전체 조회',
    description: '쩔 해주는 유저가 올린 게시글 전체 조회',
  })
  @ApiResponse({ status: 200, description: '쩔 게시글 전체 조회' })
  async boardInfo(@Query('page') page: number): Promise<any> {
    const getBoardInfo = await this.boardService.boardInfo(page);
    return getBoardInfo;
  }

  @Get('/:board1_id')
  @ApiOperation({
    summary: '쩔 게시글 상세조회',
    description: '쩔 해주는 유저가 올린 게시글 상세조회',
  })
  @ApiResponse({ status: 200, description: '쩔 게시글 전체 조회' })
  async boardDetailInfo(@Param('board1_id') board1_id: number): Promise<any> {
    console.log(1)
    const getBoardInfo = await this.boardService.boardDetailInfo(board1_id);
    return getBoardInfo;
  }

  @Get('/search')
  @ApiOperation({
    summary: '쩔 게시글 검색 조회',
    description: '쩔 해주는 유저가 올린 게시글을 검색해서 전체 조회',
  })
  @ApiResponse({ status: 200, description: '쩔 게시글 전체 조회' })
  @ApiQuery({ name: 'searchMeso', required: false, type: String })
  @ApiQuery({ name: 'searchTitle', required: false, type: String })
  @ApiQuery({ name: 'searchNickname', required: false, type: String })
  @ApiQuery({ name: 'searchHuntingGround', required: false, type: String })
  @ApiQuery({ name: 'searchLevel', required: false, type: String })
  @ApiQuery({ name: 'searchSubJob', required: false, type: String })
  @ApiQuery({ name: 'searchProgressKind', required: false, type: String })
  @ApiQuery({ name: 'searchProgressTime', required: false, type: String })
  @ApiQuery({ name: 'searchDiscordName', required: false, type: String })
  async boardSearchInfo(
    @Query('page') page?: number,
    @Query('searchMeso') searchMeso?: number,
    @Query('searchTitle') searchTitle?: string,
    @Query('searchNickname') searchNickname?: string,
    @Query('searchHuntingGround') searchHuntingGround?: string,
    @Query('searchLevel') searchLevel?: number,
    @Query('searchSubJob') searchSubJob?: string,
    @Query('searchProgressKind') searchProgressKind?: string,
    @Query('searchProgressTime') searchProgressTime?: number,
    @Query('searchDiscordName') searchDiscordName?: string,
  ): Promise<any> {
    const getBoardSearchInfo = await this.boardService.boardSearchInfo(
      page,
      searchMeso,
      searchTitle,
      searchNickname,
      searchHuntingGround,
      searchLevel,
      searchSubJob,
      searchProgressKind,
      searchProgressTime,
      searchDiscordName,
    );
    // console.log("asdfasdfasdfasdfsadfsa",getBoardSearchInfo)
    return getBoardSearchInfo;
  }

  @UseGuards(AuthGuard)
  @Post('/post')
  async postBoard(
    @Body() createBoardDto: CreateBoardDto,
    @Req() request: Request,
  ): Promise<any> {
    const discordId = request.headers['discord_id'];
    // console.log(discordId)
    // const userId = request['user'].userId;
    const getBoardInfo = await this.boardService.postBoard(
      createBoardDto,
      discordId
    );
    return getBoardInfo;
  }
}
