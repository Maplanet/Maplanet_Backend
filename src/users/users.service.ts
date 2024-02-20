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
    private usersRepository: Repository<Users>
  ) {}

  async discordLogin(code) {
    const requestToken = code;
    const userdata:any = {}
    console.log('code', code)
    let tokenResponse, userResponse;
    try {
      tokenResponse = await axios({
          method: 'post',
          url: `https://discord.com/api/oauth2/token`,
          data: {
              client_id: process.env.DISCORD_CLIENT_ID,
              client_secret: process.env.DISCORD_CLIENT_SECRET,
              grant_type: 'authorization_code',
              code: requestToken,
              redirect_uri: 'http://localhost:3000/discord/login',
              scope: 'identify, email',
          },
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          }
      });

      const accessToken = tokenResponse.data.access_token;

      userResponse = await axios.get('https://discordapp.com/api/users/@me', {
          headers: {
              authorization: `Bearer ${accessToken}`,
          },
      });
      console.log("accessToken",accessToken)
      console.log("refreshToken",tokenResponse.data.refresh_token)
      console.log(userResponse.data);

      const userAvatarUrl:string = `https://cdn.discordapp.com/avatars/${userResponse.data.id}/${userResponse.data.avatar}`
      
      userdata.access_token = accessToken
      userdata.refreshToken = tokenResponse.data.refresh_token
      userdata.discordImage = userAvatarUrl.slice(-4) === 'null'  ? "https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png" : `https://cdn.discordapp.com/avatars/${userResponse.data.id}/${userResponse.data.avatar}`
      // console.log(userAvatarUrl.slice(-4))
      console.log('data : ', userdata)

      //db에 저장할 값들 저장

      //클라이언트헤더에 토큰이랑 사용자 id반환
      // req.headers = {
      //   userdata
      // }
      return userdata
      
  } catch (error) {
      console.error(`Error in getting token or user data from Discord API: ${error.message}`);
  }
  
  }

  async checkUser(discordId:string){
    //db에 조회해서 디스코드 로그인 조회한다음에 없으면 게시글작성 못하게 예외처리
    //7489654321358
    const db에저장된디스코드아이디 = await this.usersRepository.exist({
      where:{ discord_id: discordId }
    })

    return db에저장된디스코드아이디
  }
}

//디스코드 이미지 나오게 하는법
//https://cdn.discordapp.com/avatars/{user_id}/{avatar_hash}
//  id: '707954708060569670',
//  avatar: '530e94ab89cf404c9d8ff490b2c8f54e',
//https://cdn.discordapp.com/avatars/707954708060569670/530e94ab89cf404c9d8ff490b2c8f54e