import { Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { ReportService } from './report.service';

@Controller()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  
  // 유저 신고하기
  @UseGuards(AccessTokenGuard)
  @Patch('/userprofile/:user_id/report')
  async reportUser(@Param('user_id') user_id: any, @Req() req): Promise<any> {
    const myUserId = req.user
    return await this.reportService.reportUser(myUserId, user_id);
  }
}
