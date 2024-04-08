import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Equal, Like, Repository, UpdateResult } from 'typeorm';
import { CreatePartyDto } from './dto/create-party.dto';
import { Party } from './entities/party.entity';

@Injectable()
export class PartyService {
  constructor(
    @InjectRepository(Party)
    private partyRepository: Repository<Party>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async partyInfo(page: number = 1): Promise<any> {
    try {
      const limit = 8;
      const skip = (page - 1) * limit;
      const take = limit;

      const board4 = await this.partyRepository.find({
        select: [
          'user_id',
          'board4_id',
          'discord_id',
          'title',
          'hunting_ground',
          'progress_time',
          'recruit_people_count',
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

      const modifiedBoard4 = board4.map(({ Users: { report_count, manner_count }, created_at, ...board }) => {
    
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
      return modifiedBoard4;
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '파티모집 게시글 전체 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async partyPageCount(): Promise<any> {
    const partyCount = await this.partyRepository.count();
    return partyCount;
  }

  async partyViewCount(board4_id: number): Promise<UpdateResult> {
    return await this.partyRepository.update(
      { board4_id },
      { view_count: () => 'view_count + 1' },
    );
  }

  async partyDetailInfo(board4_id: number): Promise<any> {
    try {
      const partyDetailInfo = await this.partyRepository.findOne({
        where: { board4_id },
        select: [
          'user_id',
          'board4_id',
          'discord_id',
          'title',
          'maple_nickname',
          'hunting_ground',
          'progress_time',
          'parking',
          'recruit_people_count',
          'first_floor',
          'second_floor',
          'third_floor',
          'fourth_floor',
          'fifth_floor',
          'sixth_floor',
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
      // console.log(partyDetailInfo)
      await this.partyViewCount(board4_id);

      const {
        Users: { report_count, manner_count },
        created_at,
        ...board4
      } = partyDetailInfo;

      const currentTime = new Date();
      
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
        ...board4,
        report_count,
        manner_count,
        timeDifference, 
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '파티모집 게시글 상세 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async partySearchInfo(
    page: number = 1,
    searchTitle: string,
    searchHuntingGround: string,
    searchProgressTime: number,
    searchDiscordName: string,
  ): Promise<any> {
    try {
      const limit = 8;
      const skip = (page - 1) * limit;
      const take = limit;
      const [searchedParty, totalCount] =
        await this.partyRepository.findAndCount({
          where: [
            searchTitle && { title: Like(`%${searchTitle}%`) },
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
            'board4_id',
            'discord_id',
            'title',
            'hunting_ground',
            'progress_time',
            'recruit_people_count',
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

        const modifiedSearchParty = searchedParty.map(({ Users: { report_count, manner_count }, created_at, ...board4 }) => {

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
            ...board4,
            report_count,
            manner_count,
            timeDifference,
          };
        });

      return { search4Data: modifiedSearchParty, totalCount };
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '파티모집 게시글 검색 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async postParty(createPartyDto: CreatePartyDto, user: any): Promise<any> {
    try {
      const {
        title,
        maple_nickname,
        hunting_ground,
        progress_time,
        parking,
        recruit_people_count,
        first_floor,
        second_floor,
        third_floor,
        fourth_floor,
        fifth_floor,
        sixth_floor,
      } = createPartyDto;

      const createParty = await this.partyRepository.create({
        user_id: user.user_id,
        title,
        maple_nickname,
        hunting_ground,
        progress_time,
        parking,
        recruit_people_count,
        first_floor,
        second_floor,
        third_floor,
        fourth_floor,
        fifth_floor,
        sixth_floor,
        discord_id: user.discord_id,
        discord_username: user.username,
        discord_global_name: user.global_name,
        discord_image: user.avatar,
      });

      await this.partyRepository.save(createParty);
      return { msg: '파티모집 게시글 등록이 완료되었습니다.' };
    } catch (error) {
      throw new HttpException(
        {
          status: 401,
          error: {
            message: '파티모집 게시글 등록 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  }

  async completeParty(board4_id: number, user_id: any): Promise<any> {
    try {
      const party = await this.partyRepository.findOne({
        where: {
          board4_id,
        },
      });

      const user = await this.usersRepository.findOne({
        where: {
          user_id: user_id,
        },
      });

      if (!party) {
        throw new NotFoundException('게시글이 존재하지 않습니다.');
      }

      // if(board.user_id !== user_id) {
      //   throw new NotFoundException('다른 사람이 작성한 게시글에 완료처리를 할 수 없습니다.')
      // }

      if (party.user_id === user.user_id) {
        if (!party.complete) {
          party.complete = true;
          user.progress_count += 1;
          await this.usersRepository.save(user);
        } else {
          party.complete = false;
          user.progress_count -= 1;
          await this.usersRepository.save(user);
        }

        await this.partyRepository.save(party);

        if (party.complete) {
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
            message: '파티모집 게시글 완료 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  }
}
