import { Controller, Param, Patch } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  
  // 유저 신고하기
  // @UseGuards(AuthGuard)
  @Patch('/userprofile/:user_id/report')
  async reportUser(@Param('user_id') user_id: any): Promise<any> {
    const myUserId = 2
    return await this.reportService.reportUser(myUserId, user_id);
  }
}
