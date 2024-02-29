import { Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { MannerService } from './manner.service';

@Controller()
export class MannerController {
    constructor(private readonly mannerService: MannerService) {}

// 유저 신고하기
@UseGuards(AccessTokenGuard)
@Patch('/userprofile/:user_id/manner')
  async mannerUser(@Param('user_id') user_id: any, @Req() req): Promise<any> {
    const myUserId = req.user
    return await this.mannerService.mannerUser(myUserId, user_id);
  }
}
