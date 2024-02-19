import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { DiscordStrategy } from './discord.strategy';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    PassportModule,
    AppModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, DiscordStrategy, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
