import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { DiscordOAuth2Credentials } from './entity/discord.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(DiscordOAuth2Credentials)
    private readonly DiscordRepository: Repository<DiscordOAuth2Credentials>,
  ) {}

  async findUserFromDiscordId(discordId: string): Promise<any> {
    const user = await this.usersService.findOne(discordId);

    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
  async validateOAuth2(Details) {
    const { discordId } = Details;
    console.log(discordId);
    await this.usersService.saveUser(Details);
    const oauth2 = await this.findOAuth2(discordId);
    return oauth2 ? this.updateOAuth2(Details) : this.createOAuth2(Details);
  }

  createOAuth2(Details) {
    console.log(Details);
    const { id, encryptedAccessToken, encryptedRefreshToken } = Details;
    const oauth2User = this.DiscordRepository.create({
      discordId: id,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
    });
    console.log(oauth2User);
    return this.DiscordRepository.save(oauth2User);
  }

  async updateOAuth2(Details) {
    console.log(Details);
    const { discordId, accessToken, refreshToken } = Details;
    await this.DiscordRepository.update(discordId, {
      accessToken,
      refreshToken,
    });
    return Details;
  }

  findOAuth2(discordId) {
    console.log('durl', discordId);
    return this.DiscordRepository.findOne({
      where: { discordId: discordId },
    });
  }
}
