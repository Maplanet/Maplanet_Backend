import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

    @Get('/mainpage')
    @ApiOperation({
        summary: '메인 페이지',
        description: '잠쩔 최신 게시글 3개, 겹사 최신 게시글 3개, 상단 공지사항, 방문유저 수 조회, 매너 지수 높은 잠쩔 게시글 3개, 겹사 건당 메소 높은 게시글 3개'
      })
    @ApiResponse({ status: 200, description: '잠쩔 게시글 3개, 겹사 게시글 3개, 상단 공지사항, 방문유저 수 조회, 매너 지수 높은 잠쩔 게시글 3개, 겹사 건당 메소 높은 게시글 3개' })
    async mainpage(): Promise<any> {
      const maindata: any = {}
      const getBoard1Data = await this.appService.getBoard1Data()
      maindata.board1Data = getBoard1Data

      const getBoard2Data = await this.appService.getBoard2Data()
      maindata.board2Data = getBoard2Data

      const highestManner3 = await this.appService.getManner3()
      maindata.board1MannerData = highestManner3

      return maindata
    }

}
