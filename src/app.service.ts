import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board/entities/board.entity';
import { Board2 } from './board2/entities/board2.entity';
import { ConfigService } from '@nestjs/config';
import { Notice } from './notice/entities/notice.entity';
import { Redis } from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(Board2)
    private board2Repository: Repository<Board2>,
    private readonly configservice: ConfigService,
    @InjectRepository(Notice)
    private readonly noticeReporotory: Repository<Notice>,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  getHello(): string {
    const apiKey = this.configservice.get<string>('SECRET_PASSPHRASE');
    const env = this.configservice.get<string>('NODE_ENV');
    console.log(apiKey + 1234);
    return `${env}`;
  }

  async getBoard1Data() {
    try {
      const board1Data = await this.boardRepository.find({
        select: [
          'board1_id',
          'user_id',
          'discord_id',
          'title',
          'meso',
          'hunting_ground',
          'progress_kind',
          'progress_time',
          'sub_job',
          'discord_global_name',
          'discord_image',
          'view_count',
          'complete',
          'created_at',
          'updated_at',
        ],
        order: {
          created_at: 'DESC',
        },
        take: 3,
        relations: ['Users'],
      });
      const modifiedBoard1 = board1Data.map(
        ({ Users: { manner_count, report_count }, ...board }) => ({
          ...board,
          manner_count,
          report_count,
        }),
      );
      return modifiedBoard1;
    } catch (error) {
      console.error(`메인페이지 쩔 게시글 조회 에러: ${error.message}`);
    }
  }

  async getBoard2Data() {
    try {
      const board2Data = await this.board2Repository.find({
        select: [
          'board2_id',
          'discord_id',
          'title',
          'meso',
          'report_kind',
          'place_theif_nickname',
          'discord_global_name',
          'discord_image',
          'view_count',
          'complete',
          'created_at',
          'updated_at',
        ],
        order: {
          created_at: 'DESC',
        },
        take: 3,
        relations: ['Users'],
      });
      const modifiedBoard2 = board2Data.map(
        ({ Users: { manner_count, report_count }, ...board2 }) => ({
          ...board2,
          manner_count,
          report_count,
        }),
      );
      return modifiedBoard2;
    } catch (error) {
      console.error(`메인페이지 겹사 게시글 조회 에러: ${error.message}`);
    }
  }

  async getManner3() {
    try {
      const boardData = await this.boardRepository.find({
        select: [
          'board1_id',
          'user_id',
          'discord_id',
          'discord_global_name',
          'discord_image',
        ],
        relations: ['Users'],
      });

      const modifiedBoard = boardData
        .map(({ Users: { manner_count }, ...board }) => ({
          ...board,
          manner_count,
        }))
        .sort((a, b) => b.manner_count - a.manner_count)
        .filter((board) => board.manner_count !== null)
        .slice(0, 3);

      return modifiedBoard;
    } catch (error) {
      console.error(`메인페이지 겹사 게시글 조회 에러: ${error.message}`);
    }
  }

  async highestMeso3(): Promise<any> {
    try {
      const board2Data = await this.board2Repository.find({
        select: [
          'board2_id',
          'user_id',
          'discord_id',
          'discord_global_name',
          'discord_image',
          'meso',
        ],
        relations: ['Users'],
      });

      const modifiedBoard2 = board2Data
        .map(({ Users: { manner_count }, ...board2 }) => ({
          ...board2,
          manner_count,
        }))
        .sort((a, b) => b.meso - a.meso)
        .filter((board2) => board2.meso !== null)
        .slice(0, 3);

      return modifiedBoard2;
    } catch (error) {
      console.error(`메인페이지 겹사 게시글 조회 에러: ${error.message}`);
    }
  }

  async noticeData(): Promise<any> {
    try {
      const notice = await this.noticeReporotory.find({
        select: ['notice_id', 'category', 'title'],
        take: 1,
        order: {
          created_at: 'DESC',
        },
      });

      return notice[0];
    } catch (error) {
      console.error(`메인페이지 공지사항 조회 에러: ${error.message}`);
    }
  }

  //전체 접속한 유저 수
  async allVisitors(): Promise<number> {
    let total_visitors_str = await this.redisClient.get('total_visitors');
    console.log(total_visitors_str);
    let total_visitors = Number(total_visitors_str);
    if (isNaN(total_visitors)) {
      total_visitors = 0;
    }
    total_visitors++;
    await this.redisClient.set('total_visitors', String(total_visitors));
    return total_visitors;
  }

  //오늘 접속한 유저 수
  async incrementTodayVisitors(): Promise<void> {
    await this.redisClient.incr('visitors_today');
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async resetDailyVisitors(): Promise<void> {
    const visitors = await this.redisClient.get('visitors_today');
    console.log(visitors);
    if (visitors) {
      await this.redisClient.set('visitors_today', '0');
    }
  }

  async todayVisitors(): Promise<number> {
    const visitors = await this.redisClient.get('visitors_today');
    return visitors ? parseInt(visitors) : 0;
  }

  // 현재 로그인한 유저
  // async loginUser(userId: string): Promise<void> {
  //   await this.redis.sAdd('logged_in_users', userId);
  // }

  // async logoutUser(userId: string): Promise<void> {
  //   await this.redis.sRem('logged_in_users', userId);
  // }

  // async getLoggedInUserCount(): Promise<number> {
  //   const loggedInUsersCount = await this.redis.sCard('logged_in_users');
  //   return loggedInUsersCount;
  // }

  //야매 현재 로그인한 유저
  async getLoggedInUserCount(): Promise<number> {
    const visitorsToday = await this.todayVisitors();
    const loggedInUsersCount = Math.ceil(visitorsToday / 3);
    return loggedInUsersCount;
  }
}
