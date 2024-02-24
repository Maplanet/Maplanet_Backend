import { Injectable } from '@nestjs/common';
import { Equal, Like, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  async boardInfo(page: number = 1): Promise<any> {
    try {
      const limit = 5;
      const skip = (page - 1) * limit;
      const take = limit;

      const board1 = await this.boardRepository.find({
        select: [
          'user_id',
          'board1_id',
          'discord_id',
          'meso',
          'title',
          'hunting_ground',
          'sub_job',
          'progress_kind',
          'progress_time',
          'discord_global_name',
          'discord_image',
          'view_count',
          'complete',
          'created_at',
          'updated_at',
        ],
        skip,
        take,
        order: {
          created_at: 'DESC', 
        },
        relations: ['Users']
    });

    const modifiedBoard1 = board1.map(({ Users: { report_count, manner_count }, ...board }) => ({
        ...board,
        report_count,
        manner_count,
      }));
    return { board1Data: modifiedBoard1 };
    } catch (error) {
      console.error(`쩔 게시글 조회 에러: ${error.message}`);
    }
  }

  async boardDetailInfo(board1_id: number):Promise<any> {
    try{
    const boardDetailInfo = await this.boardRepository.findOne({
        where: {board1_id},
        select: [
          'user_id',
          'board1_id',
          'discord_id',
          'meso',
          'title',
          'maple_nickname',
          'hunting_ground',
          'level',
          'sub_job',
          'progress_kind',
          'progress_time',
          'position',
          'discord_global_name',
          'discord_image',
          'view_count',
          'complete',
          'created_at',
          'updated_at',
        ],
        order: {
          created_at: 'DESC', 
        },
        relations: ['Users']
    });
    console.log(boardDetailInfo)

    const { Users: { report_count, manner_count }, ...board } = boardDetailInfo;

    return {
            ...board,
            report_count,
            manner_count,
        }
    } catch (error) {
        console.error(`쩔 게시글 상세 조회 에러: ${error.message}`);
      }
  }
 
  async boardSearchInfo(
    page: number = 1,
    searchMeso: number, 
    searchTitle: string,
    searchNickname: string,
    searchHuntingGround: string,
    searchLevel: number,
    searchSubJob: string,
    searchProgressKind: string,
    searchProgressTime: number,
    searchDiscordName: string,
  ): Promise<any> {
    try {
      const limit = 5;
      const skip = (page - 1) * limit;
      const take = limit;

      const searchedBoard1 = await this.boardRepository.find({
        where: [
          { meso: Equal(searchMeso) },
          { title: Like(`%${searchTitle}%`) },
          { maple_nickname: Like(`%${searchNickname}%`) },
          { hunting_ground: Like(`%${searchHuntingGround}%`) },
          { level: Equal(searchLevel) },
          { sub_job: Like(`%${searchSubJob}%`) },
          { progress_kind: Like(`%${searchProgressKind}%`) },
          { progress_time: Equal(searchProgressTime) },
          { discord_global_name: Like(`%${searchDiscordName}%`) },
        ],
        select: [
          'user_id',
          'board1_id',
          'discord_id',
          'meso',
          'title',
          'hunting_ground',
          'sub_job',
          'progress_kind',
          'progress_time',
          'discord_global_name',
          'discord_image',
          'view_count',
          'complete',
          'created_at',
          'updated_at',
        ],
        skip,
        take,
        order: {
          created_at: 'DESC',
        },
        relations: ['Users']
      });
      const modifiedSearchBoard1 = searchedBoard1.map(({ Users: { report_count, manner_count }, ...board }) => ({
        ...board,
        report_count,
        manner_count,
      }));
      console.log('dsddddddddddddddd', searchedBoard1);

      return { search1Data: modifiedSearchBoard1 };
    } catch (error) {
      console.error(`쩔 게시글 검색 조회 에러: ${error.message}`);
    }
  }

  async postBoard(createBoardDto: CreateBoardDto, discordId: string): Promise<any> {
    try {
      const {
        meso,
        title,
        maple_nickname,
        hunting_ground,
        level,
        main_job,
        sub_job,
        progress_kind,
        progress_time,
        position,
      } = createBoardDto;

      const createBoard1 = this.boardRepository.create({
        // user_id,
        meso,
        title,
        maple_nickname,
        hunting_ground,
        level,
        main_job,
        sub_job,
        progress_kind,
        progress_time,
        position,
        discord_id: discordId,
        // discord_username: discordId,
        // discord_global_name,
        // discord_image,
        // view_count,
        // complete
      });
    //   console.log(createBoard1)

      await this.boardRepository.save(createBoard1);
      return { msg: '쩔 게시글 등록이 완료되었습니다.' };
    } catch (error) {
      console.error(`쩔 게시글 등록 에러: ${error.message}`);
    }
  }
}
