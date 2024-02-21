import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DiscordStrategy } from './discord.strategy';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordOAuth2Credentials } from './entity/discord.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiscordOAuth2Credentials]),
    UsersModule,
    HttpModule,
  ],
  providers: [AuthService, DiscordStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
