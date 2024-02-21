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
    private usersRepository: Repository<Users>,
  ) {}

  // async discordLogin(code) {
  //   const userdata: any = {};

  //   try {
  //     const tokenResponse = await axios({
  //       method: 'post',
  //       url: `https://discord.com/api/oauth2/token`,
  //       data: {
  //         client_id: process.env.DISCORD_CLIENT_ID,
  //         client_secret: process.env.DISCORD_CLIENT_SECRET,
  //         grant_type: 'authorization_code',
  //         code: code,
  //         redirect_uri: 'http://localhost:3000/discord/login',
  //         scope: 'identify, email',
  //       },
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //     });

  //     const accessToken = tokenResponse.data.access_token;
  //     const refreshToken = tokenResponse.data.refresh_token;

  //     const userResponse = await axios.get(
  //       'https://discordapp.com/api/users/@me',
  //       {
  //         headers: {
  //           authorization: `Bearer ${accessToken}`,
  //         },
  //       },
  //     );
  //     console.log(userResponse.data);

  //     const discord_id = userResponse.data.id; //832823498723948
  //     const discord_username = userResponse.data.username; //1_brianpark
  //     const discord_global_name = userResponse.data.global_name; //BrianP
  //     const discord_image: string = `https://cdn.discordapp.com/avatars/${userResponse.data.id}/${userResponse.data.avatar}`;

  //     userdata.access_token = accessToken;
  //     userdata.refreshToken = refreshToken;
  //     userdata.discord_id = discord_id;
  //     userdata.discord_username = discord_username;
  //     userdata.discord_global_name = discord_global_name;
  //     userdata.discord_image =
  //       discord_image.slice(-4) === 'null'
  //         ? 'https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png'
  //         : `https://cdn.discordapp.com/avatars/${userResponse.data.id}/${userResponse.data.avatar}`;
  //     console.log('data : ', userdata);

  //     let user = await this.usersRepository.findOne({
  //       where: { discord_id },
  //     });
  //     if (!user) {
  //       user = this.usersRepository.create({
  //         discord_id,
  //         discord_username,
  //         discord_global_name,
  //         discord_image: userdata.discord_image,
  //       });
  //       await this.usersRepository.save(user);
  //     }
  //     console.log(accessToken);
  //     return { user, accessToken };

  //     // const user = await this.usersRepository.findOne({
  //     //   where: { discord_id }
  //     // });

  //     // if(user) {
  //     //   return userdata
  //     // } else {
  //     //   const discordUser = await this.usersRepository.create({ discord_id, discord_username, discord_global_name, discord_image: userdata.discord_image })
  //     //   await this.usersRepository.save(discordUser)
  //     // }
  //   } catch (error) {
  //     console.error(
  //       `Error in getting token or user data from Discord API: ${error.message}`,
  //     );
  //   }
  // }

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
    let userInfo = this.usersRepository.create({
      discord_id: id,
      discord_username: username,
      discord_global_name: global_name,
      discord_image:
        avatar === null
          ? 'https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png'
          : `https://cdn.discordapp.com/avatars/${id}/${avatar}`,
    });
    await this.usersRepository.save(userInfo);
  }
}

//디스코드 이미지 나오게 하는법
//https://cdn.discordapp.com/avatars/{user_id}/{avatar_hash}
//  id: '707954708060569670',
//  avatar: '530e94ab89cf404c9d8ff490b2c8f54e',
//https://cdn.discordapp.com/avatars/707954708060569670/530e94ab89cf404c9d8ff490b2c8f54e
