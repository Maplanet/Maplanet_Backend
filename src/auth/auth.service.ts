import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { DiscordOAuth2Credentials } from './entity/discord.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(DiscordOAuth2Credentials)
    private readonly DiscordRepository: Repository<DiscordOAuth2Credentials>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findUserFromDiscordId(discord_id: string): Promise<any> {
    const user = await this.usersService.findOne(discord_id);

    // console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
  async validateOAuth2(Details) {
    const { id } = Details;
    // console.log(discordId);
    await this.usersService.saveUser(Details); // 여기까지 잘됨
    console.log("Details: ", Details)
    const oauth2 = await this.findOAuth2(id);
    return oauth2 ? this.updateOAuth2(Details) : this.createOAuth2(Details);
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
    await this.DiscordRepository.update({
      discord_id: id},
      {
        access_token: accessToken,
        refresh_token: refreshToken,
    });
    return Details;
  }

  findOAuth2(discord_id) {
    console.log('durl', discord_id);
    return this.DiscordRepository.findOne({
      where: { discord_id: discord_id },
    });
  }
}
