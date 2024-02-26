import { BadRequestException, Injectable } from '@nestjs/common';
import { Notice } from './entities/notice.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreatePost } from './interface/notice.interface';
import { CreateNoticeDto } from './dto/createnotice.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeReporotory: Repository<Notice>,
  ) {}

  async getAllNoticePost(page: number): Promise<any> {
    try{
      const limit = 5;
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
          'updated_at'
        ],
        skip,
        take,
        order: {
          created_at: 'DESC', 
        }
      });

      return getAllNotice
    } catch (error) {
      console.error(`공지사항 전체 조회 에러: ${error.message}`);
    }
  }

  async noticeViewCount(notice_id: number): Promise<UpdateResult> {
    return await this.noticeReporotory.update({ notice_id }, {view_count: () => 'view_count + 1'});
  }
  
  async getNoticeDetail(notice_id: number):Promise<any> {
    const getOneNotice = await this.noticeReporotory.findOne({
      where: {notice_id}
    });
    await this.noticeViewCount(notice_id);
    return getOneNotice;
  }

  async postNotice(createNoticeDto) {
    createNoticeDto.administrator_id = 2;
    console.log(createNoticeDto);

    const IsExistAdmin = await this.findUserByUserId(2);
    console.log(IsExistAdmin);
    const postCd = this.noticeReporotory.create(createNoticeDto);

    await this.noticeReporotory.save(postCd);

    return 2;
  }

  private async findUserByUserId(admin_id): Promise<Boolean> {
    const findUserByUserId = await this.noticeReporotory.findOne({
      where: { administrator_id: admin_id },
    });

    console.log(findUserByUserId);
    if (!findUserByUserId) {
      throw new BadRequestException('존재하지 않는 관리자계정');
    }
    return true;
  }
}
