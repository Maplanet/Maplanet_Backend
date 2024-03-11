import { Injectable } from '@nestjs/common';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from 'src/board/entities/board.entity';
import { Board2 } from 'src/board2/entities/board2.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Board)
    private readonly board1Repository: Repository<Board>,
    @InjectRepository(Board2)
    private readonly board2Repository: Repository<Board2>,
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
    const limit = 12;
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
      relations: ['Users'],
    });

    const modifiedBoard1 = board1Profile.map(
      ({ Users: { report_count, manner_count }, ...board }) => ({
        ...board,
        report_count,
        manner_count,
      }),
    );

    return modifiedBoard1;
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
    const modifiedBoard2 = board2Profile.map(
      ({ Users: { report_count, manner_count }, ...board2 }) => ({
        ...board2,
        report_count,
        manner_count,
      }),
    );
    return modifiedBoard2;
  }

  async userPageCountBoard1(user_id: number): Promise<number> {
    const userPageCountBoard1 = await this.board1Repository.count({
      where: { user_id },
    });
    return userPageCountBoard1;
  }

  async userPageCountBoard2(user_id: number): Promise<number> {
    const userPageCountBoard2 = await this.board2Repository.count({
      where: { user_id },
    });
    return userPageCountBoard2;
  }
}
