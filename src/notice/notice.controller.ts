import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { Roles } from './role/Roles.Decorator';
import { Role } from './role/role.enum';
import { CreateNoticeDto } from './dto/createnotice.dto';
import { RolesGuard } from './roles.guard';
import { http } from 'winston';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get('/')
  @HttpCode(200)
  async getNoticeAll(@Query('page') page: number): Promise<any> {
    const AllPosts = this.noticeService.getAllNoticePost(page);
    return AllPosts;
  }

  @Get('/:notice_id')
  @HttpCode(200)
  async getNoticeDetail(@Param('notice_id') notice_id: number): Promise<any> {
    const getOneNotice = this.noticeService.getNoticeDetail(notice_id);
    return getOneNotice;
  }

  @Post('/')
  @UseGuards(AccessTokenGuard)
  //@UseGuards(RolesGuard, AccessTokenGuard)
  //@Roles(Role.Admin)
  @HttpCode(201)
  async postNotice(@Body() createNoticeDto: CreateNoticeDto) {
    const postNotice = await this.noticeService.postNotice(createNoticeDto);
    console.log(postNotice);
    return 1;
  }
}
