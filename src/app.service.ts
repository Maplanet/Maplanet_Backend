import {
  HttpException,
  Inject,
  Injectable,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board/entities/board.entity';
import { Board2 } from './board2/entities/board2.entity';
import { ConfigService } from '@nestjs/config';
import { Notice } from './notice/entities/notice.entity';
import { Redis } from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WoodCutter } from './woodcutter/entities/woodcutter.entity';
import { Party } from './party/entities/party.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(Board2)
    private board2Repository: Repository<Board2>,
    private readonly configservice: ConfigService,
    @InjectRepository(WoodCutter)
    private readonly woodCutterReporotory: Repository<WoodCutter>,
    @InjectRepository(Party)
    private readonly partyReporotory: Repository<Party>,
    @InjectRepository(Notice)
    private readonly noticeReporotory: Repository<Notice>,
    @InjectRedis() private readonly redisClient: Redis,
    private readonly configService: ConfigService,
  ) {}

  getHello(@Req() req, @Res() res): void {
    res.redirect(this.configService.get<string>('loginRedirectURL'));
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
        take: 2,
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
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '메인페이지 쩔 게시글 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async getBoard2Data() {
    try {
      const board2Data = await this.board2Repository.find({
        select: [
          'board2_id',
          'user_id',
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
        take: 2,
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
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '메인페이지 겹사 게시글 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async getBoard3Data() {
    try {
      const board3Data = await this.woodCutterReporotory.find({
        select: [
          'board3_id',
          'user_id',
          'discord_id',
          'title',
          'meso',
          'hunting_ground',
          'progress_time',
          'sub_job',
          'level',
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
        take: 2,
        relations: ['Users'],
      });
      const modifiedBoard3 = board3Data.map(
        ({ Users: { manner_count, report_count }, ...board3 }) => ({
          ...board3,
          manner_count,
          report_count,
        }),
      );
      return modifiedBoard3;
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '메인페이지 나무꾼 게시글 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async getBoard4Data() {
    try {
      const board4Data = await this.partyReporotory.find({
        select: [
          'board4_id',
          'user_id',
          'discord_id',
          'title',
          'hunting_ground',
          'progress_time',
          'recruit_people_count',
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
        take: 2,
        relations: ['Users'],
      });
      const modifiedBoard4 = board4Data.map(
        ({ Users: { manner_count, report_count }, ...board4 }) => ({
          ...board4,
          manner_count,
          report_count,
        }),
      );
      return modifiedBoard4;
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '메인페이지 파티사냥 게시글 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  // async getManner3() {
  //   try {
  //     const boardData = await this.boardRepository.find({
  //       select: [
  //         'board1_id',
  //         'user_id',
  //         'discord_id',
  //         'discord_global_name',
  //         'discord_image',
  //       ],
  //       relations: ['Users'],
  //     });

  //     const modifiedBoard = boardData
  //       .map(({ Users: { manner_count }, ...board }) => ({
  //         ...board,
  //         manner_count,
  //       }))
  //       .sort((a, b) => b.manner_count - a.manner_count)
  //       .filter((board) => board.manner_count !== null)
  //       .slice(0, 3);

  //     return modifiedBoard;
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: 400,
  //         error: {
  //           message: '메인페이지 매너 게시글 3개 조회 에러',
  //           detail: error.message,
  //         },
  //       },
  //       400,
  //     );
  //   }
  // }

  // async highestMeso3(): Promise<any> {
  //   try {
  //     const board2Data = await this.board2Repository.find({
  //       select: [
  //         'board2_id',
  //         'user_id',
  //         'discord_id',
  //         'discord_global_name',
  //         'discord_image',
  //         'meso',
  //       ],
  //       relations: ['Users'],
  //     });

  //     const modifiedBoard2 = board2Data
  //       .map(({ Users: { manner_count }, ...board2 }) => ({
  //         ...board2,
  //         manner_count,
  //       }))
  //       .sort((a, b) => b.meso - a.meso)
  //       .filter((board2) => board2.meso !== null)
  //       .slice(0, 3);

  //     return modifiedBoard2;
  //   } catch (error) {
  //     throw new HttpException(
  //       {
  //         status: 400,
  //         error: {
  //           message: '메인페이지 메소 높은 게시글 조회 에러',
  //           detail: error.message,
  //         },
  //       },
  //       400,
  //     );
  //   }
  // }

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
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '메인페이지 공지사항 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  //전체 접속한 유저 수
  async allVisitors(): Promise<number> {
    try {
      let total_visitors_str = await this.redisClient.get('total_visitors');
      let total_visitors = Number(total_visitors_str);
      if (isNaN(total_visitors)) {
        total_visitors = 0;
      }
      total_visitors++;
      await this.redisClient.set('total_visitors', String(total_visitors));
      return total_visitors;
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '메인페이지 전체 접속한 유저 수 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  //오늘 접속한 유저 수
  async incrementTodayVisitors(): Promise<void> {
    await this.redisClient.incr('visitors_today');
  }

  @Cron(CronExpression.EVERY_DAY_AT_3PM)
  async resetDailyVisitors(): Promise<void> {
    const visitors = await this.redisClient.get('visitors_today');
    if (visitors) {
      await this.redisClient.set('visitors_today', '0');
    }
  }

  async todayVisitors(): Promise<number> {
    try {
      const visitors = await this.redisClient.get('visitors_today');
      return visitors ? parseInt(visitors) : 0;
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: '메인페이지 오늘 접속한 유저 수 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }
}
