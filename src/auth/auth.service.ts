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
import { DiscdordDataType, tokenpayload } from './type/updateOaut2.type';
import { access } from 'fs';

const adminList: string[] = ['ystar5008@naver.com'];
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
  ) {
    this.adminList = adminList;
  }

  async findUserFromDiscordId(discord_id: string): Promise<any> {
    const user = await this.usersService.findOne(discord_id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
  async validateOAuth2(data) {
    let { id, username, avatar, email } = data;
    const userAvatar = `https://cdn.discordapp.com/avatars/${id}/${avatar}`;
    const userAvatarNull =
      'https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png';
    if (!avatar) {
      avatar = userAvatarNull;
    } else {
      avatar = userAvatar;
    }

    if (!data) {
      throw new BadRequestException('잘못된 사용자');
    }

    const payload = {
      id,
      username,
      avatar,
      email,
    };

    await this.usersService.saveUser(data);

    const access_token: string = this.getAccessToken(payload);

    this.getAndSaveRefreshToken(payload);

    const oauth2 = await this.findOAuth2(id);

    oauth2 ? await this.updateOAuth2(data) : await this.createOAuth2(data);

    return access_token;
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

  private getAccessToken(data: tokenpayload) {
    const { id, username, avatar, email } = data;
    const tokentype: string = 'access';

    // if (accessTokenType !== 'access') {
    //   throw new UnauthorizedException('유효하지 않은 액세스 토큰');
    // }

    return this.jwtService.sign(
      {
        id,
        username,
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

  async getAndSaveRefreshToken(data: tokenpayload) {
    const { id, username, avatar, email } = data;
    const tokentype: string = 'refresh';

    const refresh_token = this.jwtService.sign(
      {
        id,
        username,
        avatar,
        email,
        tokentype,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<number>('REFRESH_TOKEN_EXPIRESTIME'),
      },
    );
    await this.cache.set(
      id,
      refresh_token,
      this.configService.get<number>('REFRESH_TOKEN_EXPIRESTIME'),
    );
    const check = await this.cache.get(String(id));
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
}
