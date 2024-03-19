import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Users } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';
import { WoodCutter } from './entities/woodcutter.entity';
import { WoodcutterController } from './woodcutter.controller';
import { WoodcutterService } from './woodcutter.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([WoodCutter, Users]),
    UsersModule,
    AuthModule,
    HttpModule,
  ],
  controllers: [WoodcutterController],
  providers: [WoodcutterService],
})
export class WoodcutterModule {}
