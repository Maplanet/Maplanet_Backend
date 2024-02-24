import {
  Body,
  Controller,
  Get,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { Roles } from './role/Roles.Decorator';
import { Role } from './role/role.enum';
import { CreateNoticeDto } from './dto/createnotice.dto';
import { RolesGuard } from './roles.guard';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get('/')
  getNoticeAll() {}

  @Post('/')
  @UseGuards(RolesGuard)
  //@Roles(Role.Admin)
  postNotice(@Body() createNoticeDto: CreateNoticeDto) {
    console.log(createNoticeDto);
    //await this.noticeService.
    return 1;
  }
}
