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
    // await this.usersService.saveUser(Details); // 여기까지 잘됨

    //액세스 토큰과 리프레쉬 토큰 발급
    const access_token = this.getAccessToken(Details);
    const refresh_token = this.saveRefreshToken(Details);
    /**
     * 1.액세스 토큰 페이로드에 Details에 들어간 값중 필요한 데이터만
     * 2.추출해서 담고 클라이언트 응답헤더로 반환
     * 3.리프레쉬 토큰은 캐쉬 저장소에 ttl설정해서 저장함
     **/

    const stringUserData = JSON.stringify(Details);
    //2주
    await this.cache.set(String(id), stringUserData, 1209600);
    const checkcache: string = await this.cache.get(String(id));
    console.log('여기서확인', JSON.parse(checkcache));
    console.log(access_token);
    return access_token;
    const oauth2 = await this.findOAuth2(id);
    return oauth2
      ? await this.updateOAuth2(Details)
      : await this.createOAuth2(Details);
  }

  createOAuth2(Details) {
    // console.log(Details);
    const { id, accessToken, refreshToken } = Details;
    const oauth2User = this.DiscordRepository.create({
      discord_id: id,
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    console.log('oauth2User: ', oauth2User);
    return this.DiscordRepository.save(oauth2User);
  }

  async updateOAuth2(Details) {
    console.log(Details);
    const { id, accessToken, refreshToken } = Details;
    await this.DiscordRepository.update(
      {
        discord_id: id,
      },
      {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    );
    return Details;
  }

  findOAuth2(discord_id) {
    return this.DiscordRepository.findOne({
      where: { discord_id: discord_id },
    });
  }
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  getAccessToken(Details) {
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

  saveRefreshToken(Details) {
    const { id } = Details;
    //const userdata: string = JSON.stringify(Details);
    const refresh_token = this.jwtService.sign(
      {
        Details,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
        expiresIn: this.configService.get<number>('REFRESH_TOKEN_EXPIRESTIME'),
      },
    );
    const check = this.cache.set(id, refresh_token, 1209600);
    return console.log(check);
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다.');
    }
  }
}
