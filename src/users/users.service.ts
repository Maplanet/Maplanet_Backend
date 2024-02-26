import { BadRequestException, Injectable } from '@nestjs/common';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiExtraModels } from '@nestjs/swagger';
import axios from 'axios';
import { response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async checkUser(discordId: string) {
    const db에저장된디스코드아이디 = await this.usersRepository.exist({
      where: { discord_id: discordId },
    });

    return db에저장된디스코드아이디;
  }

  async findOne(discordId: string): Promise<any> {
    return this.usersRepository.findOne({
      where: { discord_id: discordId },
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
}

//디스코드 이미지 나오게 하는법
//https://cdn.discordapp.com/avatars/{user_id}/{avatar_hash}
//  id: '707954708060569670',
//  avatar: '530e94ab89cf404c9d8ff490b2c8f54e',
//https://cdn.discordapp.com/avatars/707954708060569670/530e94ab89cf404c9d8ff490b2c8f54e
