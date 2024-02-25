import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { DiscordOAuth2Credentials } from './entity/discord.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
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
  ) {}

  async findUserFromDiscordId(discord_id: string): Promise<any> {
    const user = await this.usersService.findOne(discord_id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
  async validateOAuth2(Details) {
    const { id } = Details;
    await this.usersService.saveUser(Details); // 여기까지 잘됨
    const access_token = this.getAccessToken(Details);
    const refresh_token = this.saveRefreshToken(Details);

    const oauth2 = await this.findOAuth2(id);
    console.log(oauth2);

    if (oauth2) {
      await this.updateOAuth2(Details);
    } else {
      await this.createOAuth2(Details);
    }

    return { access_token };
  }

  async createOAuth2(Details) {
    console.log(Details);
    const { id, accessToken, refreshToken } = Details;
    const oauth2User = this.DiscordRepository.create({
      discord_id: id,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    console.log('oauth2User: ', oauth2User);
    return await this.DiscordRepository.save(oauth2User);
  }

  async updateOAuth2(Details) {
    console.log('여기업데이트', Details);
    const { id, access_Token, refresh_Token } = Details;
    console.log(id, Details.access_Token, Details.refresh_Token);
    await this.DiscordRepository.update(
      {
        discord_id: id,
      },
      {
        access_token: 'yz6wnf3sk7Q9PtwZwJiMiuXFzMPfpe',
        refresh_token: '3felVCAKcNjvMigMJwbT8QHaEAEZrp',
      },
    );
    return Details;
  }

  findOAuth2(discord_id) {
    return this.DiscordRepository.findOne({
      where: { discord_id: discord_id },
    });
  }

  getAccessToken(Details) {
    Details.tokentype = 'access';
    return this.jwtService.sign(
      {
        Details,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<number>('ACCESS_TOKEN_EXPIRESTIME'),
      },
    );
  }

  async saveRefreshToken(Details) {
    const { id } = Details;
    //const userdata: string = JSON.stringify(Details);
    Details.tokentype = 'refresh';
    const refresh_token = this.jwtService.sign(
      {
        Details,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<number>('REFRESH_TOKEN_EXPIRESTIME'),
      },
    );
    console.log('리프레쉬토큰', refresh_token);
    await this.cache.set(
      String(id),
      refresh_token,
      this.configService.get<number>('REFRESH_TOKEN_EXPIRESTIME'),
    );
    const check = await this.cache.get(String(id));
    console.log(check);
    return refresh_token;
  }

  verifyToken(token) {
    console.log('토큰', token);
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

    console.log(token);
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('wrong token');
    }

    return token;
  }
}
