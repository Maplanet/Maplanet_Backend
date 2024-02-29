import { Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { ReportService } from './report.service';

@ApiTags('REPORT')
@Controller()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  
  @ApiOperation({
    summary: '유저 신고하기',
    description: '유저 신고 횟수 1 증가 시키기',
  })
  @ApiResponse({ status: 201, description: '유저 신고 횟수 1 증가, 유저 신고 횟수 1 하락' })  
  @UseGuards(AccessTokenGuard)
  @Patch('/userprofile/:user_id/report')
  async reportUser(@Param('user_id') user_id: any, @Req() req): Promise<any> {
    const myUserId = req.user
    return await this.reportService.reportUser(myUserId, user_id);
  }
}
