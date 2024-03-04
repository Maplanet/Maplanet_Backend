import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { Notice } from './entities/notice.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreatePost } from './interface/notice.interface';
import { CreateNoticeDto } from './dto/createnotice.dto';
import { Administrator } from 'src/administrator/entities/administrator.entity';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeReporotory: Repository<Notice>,
    @InjectRepository(Administrator)
    private readonly AdminRepository: Repository<Administrator>,
  ) {}

  async getAllNoticePost(page: number): Promise<any> {
    try {
      const limit = 8;
      const skip = (page - 1) * limit;
      const take = limit;

      const getAllNotice = await this.noticeReporotory.find({
        select: [
          'notice_id',
          'administrator_id',
          'title',
          'category',
          'writer',
          'view_count',
          'created_at',
          'updated_at',
        ],
        skip,
        take,
        order: {
          created_at: 'DESC',
        },
      });
      const noticeCount = await this.noticeReporotory.count()


      return {noticeData: getAllNotice, noticeCount};
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '공지사항 전체 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async noticeViewCount(notice_id: number): Promise<UpdateResult> {
    return await this.noticeReporotory.update(
      { notice_id },
      { view_count: () => 'view_count + 1' },
    );
  }

  async getNoticeDetail(notice_id: number): Promise<any> {
    try {
      const getOneNotice = await this.noticeReporotory.findOne({
        where: { notice_id },
      });
      await this.noticeViewCount(notice_id);
      return {noticeDetailData: getOneNotice};
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '공지사항 상세 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async postNotice(createNoticeDto, user_id) {
    try{
      const Admin = await this.findUserByUserId(user_id);
      createNoticeDto.administrator_id = Admin.administrator_id;
      const postCd = this.noticeReporotory.create(createNoticeDto);

      await this.noticeReporotory.save(postCd);

      return { msg: '공지사항 등록이 완료되었습니다.' };
    } catch (error) {
      throw new HttpException(
        {
          status: 401,
          error: {
            message: '공지사항 등록 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  }

  private async findUserByUserId(user_id) {
    const findUserByUserId = await this.AdminRepository.findOne({
      where: { user_id },
    });

    console.log(findUserByUserId);
    if (!findUserByUserId) {
      throw new BadRequestException('존재하지 않는 관리자계정');
    }
    return findUserByUserId;
  } 
}
