import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { WoodcutterService } from './woodcutter.service';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { WoodCutterDTO } from './dto/postWoodCutter.dto';
import { IBoard3Data, IWoodCutter } from './interface/woodcutter.interfacte';
import { WoodCutter } from './entities/woodcutter.entity';
import { pipe } from 'rxjs';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('WoodCutter')
@Controller('board3')
export class WoodcutterController {
  constructor(private readonly woodCutterService: WoodcutterService) {}

  @Get('/')
  @ApiOperation({
    summary: '나무꾼 게시글 전체 조회',
    description: '나무꾼 하는 유저가 올린 게시글 전체 조회',
  })
  @ApiResponse({ status: 200, description: '나무꾼 게시글 전체 조회' })
  async woodCutterInfo(@Query('page') page: number): Promise<any> {
    const getWoodCutterInfo = await this.woodCutterService.woodCutterInfo(page);
    const getWoodCutterCount = await this.woodCutterService.woodCutterPageCount();
    return { board3Data:
      getWoodCutterInfo,
      totalCount: getWoodCutterCount
    }
  }

  @Get('/detail/:board3_id')
  @ApiOperation({
    summary: '나무꾼 게시글 상세조회',
    description: '나무꾼 하는 유저가 올린 게시글 상세조회',
  })
  @ApiResponse({ status: 200, description: '나무꾼 게시글 전체 조회' })
  async woodCutterDetailInfo(@Param('board3_id') board3_id: number): Promise<any> {
    const getWoodCutterInfo = await this.woodCutterService.woodCutterDetailInfo(board3_id);
    return getWoodCutterInfo;
  }

  @Get('/search')
  @ApiOperation({
    summary: '나무꾼 게시글 검색 조회',
    description: '나무꾼 해주는 유저가 올린 게시글을 검색해서 전체 조회',
  })
  @ApiResponse({ status: 200, description: '나무꾼 게시글 전체 조회' })
  @ApiQuery({ name: 'searchMeso', required: false, type: Number })
  @ApiQuery({ name: 'searchTitle', required: false, type: String })
  @ApiQuery({ name: 'searchSubJob', required: false, type: String })
  @ApiQuery({ name: 'searchLevel', required: false, type: Number })
  @ApiQuery({ name: 'searchHuntingGround', required: false, type: String })
  @ApiQuery({ name: 'searchProgressTime', required: false, type: Number })
  @ApiQuery({ name: 'searchDiscordName', required: false, type: String })
  async woodCutterSearchInfo(
    @Query('page') page?: number,
    @Query('searchMeso') searchMeso?: number,
    @Query('searchTitle') searchTitle?: string,
    @Query('searchSubJob') searchSubJob?: string,
    @Query('searchLevel') searchLevel?: number,
    @Query('searchHuntingGround') searchHuntingGround?: string,
    @Query('searchProgressTime') searchProgressTime?: number,
    @Query('searchDiscordName') searchDiscordName?: string,
  ): Promise<any> {
    const { search3Data, totalCount } = await this.woodCutterService.woodCutterSearchInfo(
      page,
      searchMeso,
      searchTitle,
      searchSubJob,
      searchLevel,
      searchHuntingGround,
      searchProgressTime,
      searchDiscordName,
    );
    return { search3Data, totalCount };
  }

  @ApiOperation({
    summary: '나무꾼 게시글 등록',
    description: '나무꾼 하는 유저가 올리 게시글 등록하기',
  })
  @ApiResponse({ status: 201, description: '나무꾼 게시글 등록' })
  @UseGuards(AccessTokenGuard)
  @Post('/post')
  async postWoodCutter(
    @Body() createWoodCutterDTO: WoodCutterDTO,
    @Req() req,
  ): Promise<any> {
    const user = req.user;
    const getWoodCutterInfo = await this.woodCutterService.postWoodCutter(
      createWoodCutterDTO,
      user
    );
    return getWoodCutterInfo;
  }

  @ApiOperation({
    summary: '나무꾼 게시글 완료',
    description: '나무꾼이 끝난 게시글을 올린 유저가 완료하기 누르기',
  })
  @ApiResponse({ status: 201, description: '나무꾼 완료됨' })
  @UseGuards(AccessTokenGuard)
  @Patch('/complete/:board3_id')
  async completeWoodCutter(
    @Param('board3_id') board3_id: number, 
    @Req() req,
  ): Promise<any> {
    const {user_id} = req.user;
    return await this.woodCutterService.completeWoodCutter(board3_id, user_id);
  }

}
