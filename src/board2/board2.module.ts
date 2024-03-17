import { Module } from '@nestjs/common';
import { Board2Service } from './board2.service';
import { Board2Controller } from './board2.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Board2 } from './entities/board2.entity';
import { Users } from 'src/users/entities/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board2, Users]),
    UsersModule,
    AuthModule,
    HttpModule,
  ],
  controllers: [Board2Controller],
  providers: [Board2Service],
})
export class Board2Module {}
