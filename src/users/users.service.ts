import { HttpException, Injectable } from '@nestjs/common';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from 'src/board/entities/board.entity';
import { Board2 } from 'src/board2/entities/board2.entity';
import { WoodCutter } from 'src/woodcutter/entities/woodcutter.entity';
import { Party } from 'src/party/entities/party.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Board)
    private readonly board1Repository: Repository<Board>,
    @InjectRepository(Board2)
    private readonly board2Repository: Repository<Board2>,
    @InjectRepository(WoodCutter)
    private readonly woodCutterRepository: Repository<WoodCutter>,
    @InjectRepository(Party)
    private readonly partyRepository: Repository<Party>,
  ) {}

  async checkUser(discordId: string) {
    const db에저장된디스코드아이디 = await this.usersRepository.exist({
      where: { discord_id: discordId },
    });

    return db에저장된디스코드아이디;
  }

  async findOne(discord_id: string): Promise<any> {
    return this.usersRepository.findOne({
      where: { discord_id },
    });
  }

  async saveUser(data) {
    const { id, username, avatar, global_name } = data;
    let user = await this.usersRepository.findOne({
      where: { discord_id: id },
    });
    let findUserInfo = await this.usersRepository.findOne({
      where: {
        discord_id: id,
        discord_username: username,
        discord_image: avatar,
        discord_global_name: global_name,
      },
    });
    const userAvatar = `https://cdn.discordapp.com/avatars/${id}/${avatar}`;
    const userAvatarNull =
      'https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png';
    if (!user) {
      // db에 유저가 없으면 유저 생성
      let userInfo = this.usersRepository.create({
        discord_id: id,
        discord_username: username,
        discord_global_name: global_name,
        discord_image: avatar === null ? userAvatarNull : userAvatar,
      });
      await this.usersRepository.save(userInfo);
    } else if (!findUserInfo) {
      //디스코드 username, global name, image 변경됐을 시 업데이트
      user.discord_id = id;
      user.discord_username = username;
      user.discord_global_name = global_name;
      user.discord_image = avatar === null ? userAvatarNull : userAvatar;
      await this.usersRepository.save(user);
    }
    return user;
  }

  async userProfile(user_id: number): Promise<any> {
    const userProfile = await this.usersRepository.findOne({
      where: { user_id },
    });
    return userProfile;
  }

  async board1Profile(page: number, user_id: number): Promise<any> {
    const limit = 8;
    const skip = (page - 1) * limit;
    const take = limit;
    const board1Profile = await this.board1Repository.find({
      where: {
        user_id,
      },
      select: [
        'user_id',
        'board1_id',
        'discord_id',
        'meso',
        'title',
        'sub_job',
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
      relations: ['Users'],
    });

    const currentTime = new Date(); 

    const modifiedBoard1 = board1Profile.map(({ Users: { report_count, manner_count }, created_at, ...board }) => {
  
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

    return modifiedBoard1;
  }

  async userPageCountBoard1(user_id: number): Promise<number> {
    const userPageCountBoard1 = await this.board1Repository.count({
      where: { user_id },
    });
    return userPageCountBoard1;
  }

  async board2Profile(page: number, user_id: number): Promise<any> {
    const limit = 8;
    const skip = (page - 1) * limit;
    const take = limit;
    const board2Profile = await this.board2Repository.find({
      where: {
        user_id,
      },
      select: [
        'user_id',
        'board2_id',
        'discord_id',
        'meso',
        'report_kind',
        'title',
        'place_theif_nickname',
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

    const modifiedBoard2 = board2Profile.map(({ Users: { report_count, manner_count }, created_at, ...board }) => {
  
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

    return modifiedBoard2;
  }

  async userPageCountBoard2(user_id: number): Promise<number> {
    const userPageCountBoard2 = await this.board2Repository.count({
      where: { user_id },
    });
    return userPageCountBoard2;
  }

  async board3Profile(page: number = 1, user_id: number): Promise<any> {
      const limit = 8;
      const skip = (page - 1) * limit;
      const take = limit;

      const board3Profile = await this.woodCutterRepository.find({
        where: {
          user_id,
        },
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
        relations: ['Users']
    });
    const currentTime = new Date(); 

    const modifiedBoard3 = board3Profile.map(({ Users: { report_count, manner_count }, created_at, ...board }) => {
  
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
  }

  async userPageCountBoard3(user_id: number): Promise<number> {
    const userPageCountBoard3 = await this.woodCutterRepository.count({
      where: { user_id },
    });
    return userPageCountBoard3;
  }

  async board4Profile(page: number = 1, user_id: number): Promise<any> {
      const limit = 8;
      const skip = (page - 1) * limit;
      const take = limit;

      const board4Profile = await this.partyRepository.find({
        where: {
          user_id,
        },
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
        relations: ['Users']
    });
    const currentTime = new Date(); 

    const modifiedBoard4 = board4Profile.map(({ Users: { report_count, manner_count }, created_at, ...board }) => {
  
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
  }

  async userPageCountBoard4(user_id: number): Promise<number> {
    const userPageCountBoard4 = await this.partyRepository.count({
      where: { user_id },
    });
    return userPageCountBoard4;
  }
}
