import { Controller, Param, Patch } from '@nestjs/common';
import { MannerService } from './manner.service';

@Controller()
export class MannerController {
    constructor(private readonly mannerService: MannerService) {}

// 유저 신고하기
  // @UseGuards(AuthGuard)
  @Patch('/userprofile/:user_id/manner')
  async mannerUser(@Param('user_id') user_id: any): Promise<any> {
    const myUserId = 2
    return await this.mannerService.mannerUser(myUserId, user_id);
  }
}
