import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { DiscordOAuth2Credentials } from './entity/discord.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DiscdordDataType, ITokenpayload } from './type/updateOaut2.type';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
@Injectable()
export class AuthService {
  private readonly adminList: string[];
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cache: Cache,
    private readonly usersService: UsersService,
    @InjectRepository(DiscordOAuth2Credentials)
    private readonly DiscordRepository: Repository<DiscordOAuth2Credentials>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  async findUserFromDiscordId(discord_id: string): Promise<any> {
    const user = await this.usersService.findOne(discord_id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
  async validateOAuth2(data) {
    let { id, username, global_name, avatar, email } = data;
    console.log(data);
    const userAvatar = `https://cdn.discordapp.com/avatars/${id}/${avatar}`;
    const userAvatarNull =
      'https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png';

    if (!data) {
      throw new BadRequestException('잘못된 사용자');
    }

    if (avatar) avatar = userAvatar;
    else avatar = userAvatarNull;

    await this.usersService.saveUser(data);

    const user_id = await this.usersService.findOne(id);
    console.log('여기 유저 아이디', user_id);
    // if (!user_id) {
    //   throw new BadRequestException('존재하지 않는 유저');
    // }

    const payload: ITokenpayload = {
      discord_id: id,
      user_id: user_id,
      username,
      global_name,
      avatar,
      email,
    };

    const access_token: string = this.getAccessToken(payload);

    this.getAndSaveRefreshToken(payload);

    const oauth2 = await this.findOAuth2(id);

    oauth2 ? await this.updateOAuth2(data) : await this.createOAuth2(data);

    return { access_token, payload };
  }

  async createOAuth2(data) {
    const { id, accessToken, refreshToken } = data;
    const oauth2User = this.DiscordRepository.create({
      discord_id: id,
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    return await this.DiscordRepository.save(oauth2User);
  }

  private getAccessToken(data: ITokenpayload) {
    const { discord_id, user_id, username, global_name, avatar, email } = data;
    const tokentype: string = 'access';

    // if (accessTokenType !== 'access') {
    //   throw new UnauthorizedException('유효하지 않은 액세스 토큰');
    // }

    return this.jwtService.sign(
      {
        discord_id,
        user_id,
        username,
        global_name,
        avatar,
        email,
        tokentype: tokentype,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<number>('ACCESS_TOKEN_EXPIRESTIME'),
      },
    );
  }

  async getAndSaveRefreshToken(data: ITokenpayload) {
    const { discord_id, username, global_name, avatar, email } = data;
    const tokentype: string = 'refresh';

    const refresh_token = this.jwtService.sign(
      {
        discord_id,
        username,
        global_name,
        avatar,
        email,
        tokentype,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<number>('REFRESH_TOKEN_EXPIRESTIME'),
      },
    );
    await this.redisClient.setex(discord_id, 1209600, refresh_token);
    const check = await this.redisClient.get(String(discord_id));
    console.log('리프레쉬톸ㄴ', check);
    return refresh_token;
  }

  verifyToken(token) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다.');
    }
  }

  extractTokenFormHeader(header: string) {
    const [bearer, token] = header.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('wrong token');
    }

    return token;
  }
  async updateOAuth2(data: DiscdordDataType) {
    const { id, access_token, refresh_token } = data;
    await this.DiscordRepository.update(
      {
        discord_id: id,
      },
      {
        access_token: access_token,
        refresh_token: refresh_token,
      },
    );
    return data;
  }

  private findOAuth2(discord_id) {
    return this.DiscordRepository.findOne({
      where: { discord_id: discord_id },
    });
  }
  async deleteRefreshToken(discord_id) {
    const a = await this.redisClient.get(discord_id);
    console.log(a);
    await this.redisClient.del(discord_id);
  }
}
