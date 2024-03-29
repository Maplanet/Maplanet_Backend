import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';

@ApiTags('MAIN')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly chatService: ChatService,
  ) {}

  @Get()
  getHello(@Req() req, @Res() res): void {
    this.appService.getHello(req, res);
  }

  @Get('/main')
  @ApiOperation({
    summary: '메인 페이지',
    description:
      '잠쩔 최신 게시글 3개, 겹사 최신 게시글 3개, 상단 공지사항, 방문유저 수 조회, 매너 지수 높은 잠쩔 게시글 3개, 겹사 건당 메소 높은 게시글 3개',
  })
  @ApiResponse({
    status: 200,
    description:
      '잠쩔 게시글 3개, 겹사 게시글 3개, 상단 공지사항, 방문유저 수 조회, 매너 지수 높은 잠쩔 게시글 3개, 겹사 건당 메소 높은 게시글 3개',
  })
  async mainpage(@Req() req): Promise<any> {
    const maindata: any = {};

    const getBoard1Data = await this.appService.getBoard1Data();
    maindata.board1Data = getBoard1Data;

    const getBoard2Data = await this.appService.getBoard2Data();
    maindata.board2Data = getBoard2Data;

    const getBoard3Data = await this.appService.getBoard3Data();
    maindata.board3Data = getBoard3Data;

    const getBoard4Data = await this.appService.getBoard4Data();
    maindata.board4Data = getBoard4Data;

    // const highestManner3 = await this.appService.getManner3();
    // maindata.board1MannerData = highestManner3;

    // const highestMeso3 = await this.appService.highestMeso3();
    // maindata.board2HighMesoData = highestMeso3;

    const noticeData = await this.appService.noticeData();
    maindata.noticeData = noticeData;

    const allVisitors = await this.appService.allVisitors();
    await this.appService.incrementTodayVisitors();
    const todayVisitors = await this.appService.todayVisitors();
    // await this.appService.loginUser('1');
    // await this.appService.loginUser('2');
    // await this.appService.loginUser('3');
    // await this.appService.logoutUser('user_id_1');
    console.log(todayVisitors / 2);
    const loggedInUser = await this.chatService.getUserList();
    maindata.visitorsData = {
      total_visitors: allVisitors,
      today_visitors: todayVisitors,
      logged_in_user: todayVisitors / 2,
      //logged_in_user: loggedInUser,
    };

    return maindata;
  }
}
