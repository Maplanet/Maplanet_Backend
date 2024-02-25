import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { Roles } from './role/Roles.Decorator';
import { Role } from './role/role.enum';
import { CreateNoticeDto } from './dto/createnotice.dto';
import { RolesGuard } from './roles.guard';
import { http } from 'winston';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get('/')
  @HttpCode(200)
  async getNoticeAll(): Promise<any[]> {
    const AllPosts = this.noticeService.getAllNoticePost();
    return AllPosts;
  }

  @Post('/')
  @UseGuards(RolesGuard)
  //@Roles(Role.Admin)
  @HttpCode(201)
  async postNotice(@Body() createNoticeDto: CreateNoticeDto) {
    const postNotice = await this.noticeService.postNotice(createNoticeDto);
    console.log(postNotice);
    return 1;
  }
}
