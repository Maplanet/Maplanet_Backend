import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DiscordStrategy } from './discord.strategy';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordOAuth2Credentials } from './entity/discord.entity';
import { Users } from 'src/users/entities/users.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    CacheModule.register(),
    TypeOrmModule.forFeature([DiscordOAuth2Credentials, Users]),
    UsersModule,
    HttpModule,
  ],
  providers: [AuthService, DiscordStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
