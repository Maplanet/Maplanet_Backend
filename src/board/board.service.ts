import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Equal, Like, Repository, UpdateResult } from 'typeorm';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async boardInfo(page: number = 1): Promise<any> {
    try {
      const limit = 8;
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
    return modifiedBoard1;
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '쩔 게시글 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async board1PageCount (): Promise<any> {
    const board1Count = await this.boardRepository.count()
    return board1Count
  }

  async board1ViewCount(board1_id: number): Promise<UpdateResult> {
    return await this.boardRepository.update({ board1_id }, {view_count: () => 'view_count + 1'});
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
    // console.log(boardDetailInfo)]
    await this.board1ViewCount(board1_id);

    const { Users: { report_count, manner_count }, ...board } = boardDetailInfo;

    return {
            ...board,
            report_count,
            manner_count,
        }
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '쩔 게시글 상세 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
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
      const limit = 8;
      const skip = (page - 1) * limit;
      const take = limit;
      const [searchedBoard1, totalCount] = await this.boardRepository.findAndCount({
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

      return { search1Data: modifiedSearchBoard1, totalCount };
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '쩔 게시글 검색 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async postBoard(createBoardDto: CreateBoardDto, user: any): Promise<any> {
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
        user_id: user.user_id,
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
        discord_id: user.discord_id,
        discord_username: user.username,
        discord_global_name: user.global_name,
        discord_image: user.avatar,
      });

      await this.boardRepository.save(createBoard1);
      return { msg: '쩔 게시글 등록이 완료되었습니다.' };
    } catch (error) {
      throw new HttpException(
        {
          status: 401,
          error: {
            message: '쩔 게시글 등록 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  }

  async completeBoard1(board1_id: number, user_id: number): Promise<any> {
    try{
      const board = await this.boardRepository.findOne({
        where: {
          board1_id,
        }
      });

      const user = await this.usersRepository.findOne({
        where: {
          user_id: user_id
        }
      })

      if(!board) {
        throw new NotFoundException('게시글이 존재하지 않습니다.');
      }

      // if(board.user_id !== user_id) {
      //   throw new NotFoundException('다른 사람이 작성한 게시글에 완료처리를 할 수 없습니다.')
      // }

      if (board.user_id === user.user_id){
        if (!board.complete) {
          board.complete = true;
          user.progress_count += 1;
          await this.usersRepository.save(user)
        } else {
          board.complete = false;
          user.progress_count -= 1;
          await this.usersRepository.save(user)
        }

        await this.boardRepository.save(board);

        if (board.complete) {
          return '게시글을 완료하였습니다.';
        } else {
          return '게시글의 완료를 취소하였습니다.';
        }  
      } else {
        throw new Error ('자신의 게시글만 완료처리 할 수 있습니다.')
      }
    } catch (error) {
      throw new HttpException(
        {
          status: 401,
          error: {
            message: '쩔 게시글 완료 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  } 
}
