import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('NOTICE')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @ApiOperation({
    summary: '공지사항 전체 조회',
    description: '공지사항 데이터 전체 조회',
  })
  @ApiResponse({ status: 200, description: '관리자가 올린 공지사항 전체 조회' })
  @Get('/')
  @HttpCode(200)
  async getNoticeAll(@Query('page') page: number): Promise<any> {
    const AllPosts = this.noticeService.getAllNoticePost(page);
    return AllPosts 
  }

  @ApiOperation({
    summary: '공지사항 상세 조회',
    description: '공지사항 데이터 상세 조회',
  })
  @ApiResponse({ status: 200, description: '관리자가 올린 공지사항 상세 조회' })
  @Get('/:notice_id')
  @HttpCode(200)
  async getNoticeDetail(@Param('notice_id') notice_id: number): Promise<any> {
    const getOneNotice = this.noticeService.getNoticeDetail(notice_id);
    return getOneNotice;
  }

  @ApiOperation({
    summary: '공지사항 등록',
    description: '공지사항 관리자만 등록하기',
  })
  @ApiResponse({ status: 201, description: 'title, category, content' })
  @Post('/')
  @UseGuards(AccessTokenGuard)
  //@UseGuards(RolesGuard, AccessTokenGuard)
  //@Roles(Role.Admin)
  @HttpCode(201)
  async postNotice(@Req() req, @Body() createNoticeDto: CreateNoticeDto) {
    const { user_id } = req.user;
    return await this.noticeService.postNotice(createNoticeDto, user_id);
  }
}
