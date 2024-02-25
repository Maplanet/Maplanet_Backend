import { BadRequestException, Injectable } from '@nestjs/common';
import { Notice } from './entities/notice.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreatePost } from './interface/notice.interface';
import { CreateNoticeDto } from './dto/createnotice.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeReporotory: Repository<Notice>,
  ) {}

  async getAllNoticePost(): Promise<any[]> {
    return await this.noticeReporotory.find();
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
