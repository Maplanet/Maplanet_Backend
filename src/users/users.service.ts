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
    // @InjectRepository(Users)
        // private usersRepository: Repository<Users>
  ) {}

  async discordLogin(code) {
    const requestToken = code;
    console.log(code)
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

      // Use the access token to fetch the user's data from Discord API
      userResponse = await axios.get('https://discordapp.com/api/users/@me', {
          headers: {
              authorization: `Bearer ${accessToken}`,
          },
      });
      console.log("accessToken",accessToken)
      console.log("tokenResponse",tokenResponse)

  } catch (error) {
      console.error(`Error in getting token or user data from Discord API: ${error.message}`);
  }
  console.log(userResponse.data); // This logs the user's data
    
  }
}