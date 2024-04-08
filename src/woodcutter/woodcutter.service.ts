import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { WoodCutter } from './entities/woodcutter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Like, Repository, UpdateResult } from 'typeorm';
import { IBoard3Data, IWoodCutter } from './interface/woodcutter.interfacte';
import { WoodCutterDTO } from './dto/postWoodCutter.dto';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class WoodcutterService {
  constructor(
    @InjectRepository(WoodCutter)
    private readonly woodCutterRepository: Repository<WoodCutter>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async woodCutterInfo(page: number = 1): Promise<any> {
    try {
      const limit = 8;
      const skip = (page - 1) * limit;
      const take = limit;

      const board3 = await this.woodCutterRepository.find({
        select: [
          'user_id',
          'board3_id',
          'discord_id',
          'title',
          'meso',
          'sub_job',
          'hunting_ground',
          'progress_time',
          'level',
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
        relations: ['Users'],
      });

      const currentTime = new Date(); 

      const modifiedBoard3 = board3.map(({ Users: { report_count, manner_count }, created_at, ...board }) => {
    
        const timeDifferenceInMs = currentTime.getTime() - new Date(created_at).getTime();
        let timeDifference: string;
  
        const minute = 60000;
        const hour = 3600000;
        const day = 86400000;
        const month = 2592000000; 
        const year = 31536000000; 
  
        if (timeDifferenceInMs < minute) { 
          timeDifference = '방금 전';
        } else if (timeDifferenceInMs < hour) { 
          timeDifference = `${Math.floor(timeDifferenceInMs / minute)}분`;
        } else if (timeDifferenceInMs < day) { 
          timeDifference = `${Math.floor(timeDifferenceInMs / hour)}시간`;
        } else if (timeDifferenceInMs < month) { 
          timeDifference = `${Math.floor(timeDifferenceInMs / day)}일`;
        } else if (timeDifferenceInMs < year) { 
          timeDifference = `${Math.floor(timeDifferenceInMs / month)}개월`;
        } else {
          timeDifference = `${Math.floor(timeDifferenceInMs / year)}년`;
        }
  
        return {
          ...board,
          report_count,
          manner_count,
          created_at,
          timeDifference, 
        };
      });
      return modifiedBoard3;
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '나무꾼 게시글 전체 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async woodCutterPageCount(): Promise<any> {
    return await this.woodCutterRepository.count();
  }

  async woodCutterViewCount(board3_id: number): Promise<UpdateResult> {
    return await this.woodCutterRepository.update(
      { board3_id },
      { view_count: () => 'view_count + 1' },
    );
  }

  async woodCutterDetailInfo(board3_id: number): Promise<any> {
    try {
      const woodCutterDetailInfo = await this.woodCutterRepository.findOne({
        where: { board3_id },
        select: [
          'user_id',
          'board3_id',
          'discord_id',
          'title',
          'meso',
          'sub_job',
          'level',
          'maple_nickname',
          'hunting_ground',
          'progress_time',
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
        relations: ['Users'],
      });

      await this.woodCutterViewCount(board3_id);

      const currentTime = new Date();
  
      const {
        Users: { report_count, manner_count },
        created_at,
        ...board3
      } = woodCutterDetailInfo;
  
      
      const timeDifferenceInMs = currentTime.getTime() - new Date(created_at).getTime();
      let timeDifference: string;
  
      const minute = 60000;
      const hour = 3600000;
      const day = 86400000;
      const month = 2592000000; 
      const year = 31536000000; 
  
      if (timeDifferenceInMs < minute) {
        timeDifference = '방금 전';
      } else if (timeDifferenceInMs < hour) {
        timeDifference = `${Math.floor(timeDifferenceInMs / minute)}분 전`;
      } else if (timeDifferenceInMs < day) {
        timeDifference = `${Math.floor(timeDifferenceInMs / hour)}시간 전`;
      } else if (timeDifferenceInMs < month) {
        timeDifference = `${Math.floor(timeDifferenceInMs / day)}일 전`;
      } else if (timeDifferenceInMs < year) { 
        timeDifference = `${Math.floor(timeDifferenceInMs / month)}달 전`;
      } else {
        timeDifference = `${Math.floor(timeDifferenceInMs / year)}년 전`;
      }
  
      return {
        ...board3,
        report_count,
        manner_count,
        timeDifference, 
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '나무꾼 게시글 상세 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async woodCutterSearchInfo(
    page: number = 1,
    searchMeso?: number,
    searchTitle?: string,
    searchSubJob?: string,
    searchLevel?: number,
    searchHuntingGround?: string,
    searchProgressTime?: number,
    searchDiscordName?: string,
  ): Promise<any> {
    try {
      const limit = 8;
      const skip = (page - 1) * limit;
      const take = limit;

      const [searchedWoodCutter, totalCount] =
        await this.woodCutterRepository.findAndCount({
          where: [
            searchMeso && { meso: Equal(searchMeso) },
            searchTitle && { title: Like(`%${searchTitle}%`) },
            searchSubJob && { sub_job: Like(`%${searchSubJob}%`) },
            searchLevel && { level: Equal(searchLevel) },
            searchHuntingGround && {
              hunting_ground: Like(`%${searchHuntingGround}%`),
            },
            searchProgressTime && { progress_time: Equal(searchProgressTime) },
            searchDiscordName && {
              discord_global_name: Like(`%${searchDiscordName}%`),
            },
          ].filter(Boolean),
          select: [
            'user_id',
            'board3_id',
            'discord_id',
            'title',
            'meso',
            'sub_job',
            'hunting_ground',
            'progress_time',
            'level',
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
          relations: ['Users'],
        });

        const currentTime = new Date(); 

        const modifiedSearchWoodCutter = searchedWoodCutter.map(({ Users: { report_count, manner_count }, created_at, ...board3 }) => {

          const timeDifferenceInMs = currentTime.getTime() - new Date(created_at).getTime();
          let timeDifference: string;
    
          const minute = 60000;
          const hour = 3600000;
          const day = 86400000;
          const month = 2592000000; 
          const year = 31536000000; 
    
          if (timeDifferenceInMs < minute) { 
            timeDifference = '방금 전';
          } else if (timeDifferenceInMs < hour) { 
            timeDifference = `${Math.floor(timeDifferenceInMs / minute)}분 전`;
          } else if (timeDifferenceInMs < day) { 
            timeDifference = `${Math.floor(timeDifferenceInMs / hour)}시간 전`;
          } else if (timeDifferenceInMs < month) { 
            timeDifference = `${Math.floor(timeDifferenceInMs / day)}일 전`;
          } else if (timeDifferenceInMs < year) {
            timeDifference = `${Math.floor(timeDifferenceInMs / month)}달 전`;
          } else { 
            timeDifference = `${Math.floor(timeDifferenceInMs / year)}년 전`;
          }
    
          return {
            ...board3,
            report_count,
            manner_count,
            timeDifference,
          };
        });

      return { search3Data: modifiedSearchWoodCutter, totalCount };
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '나무꾼 게시글 검색 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async postWoodCutter(
    createWoodCutterDTO: WoodCutterDTO,
    user: any,
  ): Promise<any> {
    try {
      const {
        title,
        meso,
        main_job,
        sub_job,
        level,
        maple_nickname,
        hunting_ground,
        progress_time,
      } = createWoodCutterDTO;

      const createWoodCutter = await this.woodCutterRepository.create({
        user_id: user.user_id,
        title,
        meso,
        main_job,
        sub_job,
        level,
        maple_nickname,
        hunting_ground,
        progress_time,
        discord_id: user.discord_id,
        discord_username: user.username,
        discord_global_name: user.global_name,
        discord_image: user.avatar,
      });

      await this.woodCutterRepository.save(createWoodCutter);
      return { msg: '나무꾼 게시글 등록이 완료되었습니다.' };
    } catch (error) {
      throw new HttpException(
        {
          status: 401,
          error: {
            message: '나무꾼 게시글 등록 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  }

  async completeWoodCutter(board3_id: number, user_id: any): Promise<any> {
    try {
      const woodCutter = await this.woodCutterRepository.findOne({
        where: {
          board3_id,
        },
      });

      const user = await this.usersRepository.findOne({
        where: {
          user_id: user_id,
        },
      });

      if (!woodCutter) {
        throw new NotFoundException('게시글이 존재하지 않습니다.');
      }

      // if(board.user_id !== user_id) {
      //   throw new NotFoundException('다른 사람이 작성한 게시글에 완료처리를 할 수 없습니다.')
      // }

      if (woodCutter.user_id === user.user_id) {
        if (!woodCutter.complete) {
          woodCutter.complete = true;
          user.progress_count += 1;
          await this.usersRepository.save(user);
        } else {
          woodCutter.complete = false;
          user.progress_count -= 1;
          await this.usersRepository.save(user);
        }

        await this.woodCutterRepository.save(woodCutter);

        if (woodCutter.complete) {
          return '게시글을 완료하였습니다.';
        } else {
          return '게시글의 완료를 취소하였습니다.';
        }
      } else {
        throw new Error('자신의 게시글만 완료처리 할 수 있습니다.');
      }
    } catch (error) {
      throw new HttpException(
        {
          status: 401,
          error: {
            message: '나무꾼 게시글 완료 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  }
}
