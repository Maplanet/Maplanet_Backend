import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from '@liaoliaots/nestjs-redis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './config/database.config';

import { BoardModule } from './board/board.module';
import { Board2Module } from './board2/board2.module';
import { UsersModule } from './users/users.module';
import { ReportModule } from './report/report.module';
import { AdministratorModule } from './administrator/administrator.module';
import { NoticeModule } from './notice/notice.module';
import { AuthModule } from './auth/auth.module';
import { MannerModule } from './manner/manner.module';
import { ChatModule } from './chat/chat.module';
import { WoodcutterModule } from './woodcutter/woodcutter.module';
import { PartyModule } from './party/party.module';

import { Board } from './board/entities/board.entity';
import { Board2 } from './board2/entities/board2.entity';
import { Notice } from './notice/entities/notice.entity';
import { WoodCutter } from './woodcutter/entities/woodcutter.entity';
import { Party } from './party/entities/party.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,

      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    RedisModule.forRoot({
      readyLog: true,
      config: {
        //host: '127.0.0.1',
        host: 'my-redis',
        port: 6379,
      },
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    BoardModule,
    Board2Module,
    UsersModule,
    ReportModule,

    AdministratorModule,
    NoticeModule,
    AuthModule,
    MannerModule,
    ChatModule,
    WoodcutterModule,
    PartyModule,
    TypeOrmModule.forFeature([Board, Board2, Notice, WoodCutter, Party]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
