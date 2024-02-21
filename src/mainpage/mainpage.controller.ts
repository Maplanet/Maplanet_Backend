import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MainpageService } from './mainpage.service';

@Controller('mainpage')
export class MainpageController {
    constructor(private readonly mainpageService: MainpageService) {}

    // @Get('/')
    // @ApiOperation({
    //     summary: '메인 페이지',
    //     description: '잠쩔 최신 게시글 3개, 겹사 최신 게시글 3개, 상단 공지사항, 방문유저 수 조회, 매너 지수 높은 잠쩔 게시글 3개, 겹사 건당 메소 높은 게시글 3개'
    //   })
    // @ApiResponse({ status: 200, description: '잠쩔 게시글 3개, 겹사 게시글 3개, 상단 공지사항, 방문유저 수 조회, 매너 지수 높은 잠쩔 게시글 3개, 겹사 건당 메소 높은 게시글 3개' })
    // async mainpage(): Promise<any> {
    //     const getMainpage = await this.mainpageService.getMainpage()
    //     return getMainpage
    // }

}
