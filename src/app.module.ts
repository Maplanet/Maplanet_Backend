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
import { dataSourceOptions } from './config/data-source';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { MainpageModule } from './mainpage/mainpage.module';
import { AuthModule } from './auth/auth.module';
import { Board } from './board/entities/board.entity';
import { Board2 } from './board2/entities/board2.entity';

@Module({
  imports: [
    BoardModule,
    Board2Module,
    UsersModule,
    ReportModule,
    AdministratorModule,
    NoticeModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    NestConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    MainpageModule,
    AuthModule,
    TypeOrmModule.forFeature([Board]),
    TypeOrmModule.forFeature([Board2])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
