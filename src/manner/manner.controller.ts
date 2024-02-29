import { Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { MannerService } from './manner.service';

@ApiTags('MANNER')
@Controller()
export class MannerController {
    constructor(private readonly mannerService: MannerService) {}

  @ApiOperation({
    summary: '유저 매너 지수 올리기',
    description: '유저 매너 지수 1 증가 시키기',
  })
  @ApiResponse({ status: 201, description: '유저 매너 지수 횟수 1 증가, 유저 매너 지수 횟수 1 하락' })
  @UseGuards(AccessTokenGuard)
  @Patch('/userprofile/:user_id/manner')
    async mannerUser(@Param('user_id') user_id: any, @Req() req): Promise<any> {
    const myUserId = req.user
    return await this.mannerService.mannerUser(myUserId, user_id);
  }
}
