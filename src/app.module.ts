import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { Board2Module } from './board2/board2.module';
import { UsersModule } from './users/users.module';
import { ReportModule } from './report/report.module';
import { AdministratorModule } from './administrator/administrator.module';
import { NoticeModule } from './notice/notice.module';
import { ConfigModule, ConfigModule as NestConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { Board } from './board/entities/board.entity';
import { Board2 } from './board2/entities/board2.entity';
import { TypeOrmConfigService } from './config/database.config';
import { Notice } from './notice/entities/notice.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MannerModule } from './manner/manner.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    RedisModule.forRoot({
      readyLog: true,
      config: {
        // host: 'my-redis',
        host: '127.0.0.1',
        port: 6379,
        //password: 'bitnami'
      },
    }),
    BoardModule,
    Board2Module,
    UsersModule,
    ReportModule,
    MannerModule,
    AdministratorModule,
    NoticeModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    NestConfigModule.forRoot({
      envFilePath: ['.env', '.env.dev', '.env.prod'],
    }),
    AuthModule,
    TypeOrmModule.forFeature([Board, Board2, Notice]),
    ScheduleModule.forRoot(),
    RedisModule,
    MannerModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
