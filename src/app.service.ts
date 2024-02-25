import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board/entities/board.entity';
import { Board2 } from './board2/entities/board2.entity';
import { ConfigService } from '@nestjs/config';

interface Board1 {
  board1_id: number;
  user_id: number;
  discord_id: string;
  discord_global_name: string;
  discord_image: string;
  Users: {
    manner_count: number;
  };
}

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(Board2)
    private board2Repository: Repository<Board2>,
    private readonly configservice: ConfigService,
  ) {}
  getHello(): string {
    const apiKey = this.configservice.get<string>('SECRET_PASSPHRASE');
    const env = this.configservice.get<string>('NODE_ENV');
    console.log(apiKey + 1234);
    return `${env}`;
  }

  async getBoard1Data() {
    try{
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
        relations: ['Users']
        });
        const modifiedBoard1 = board1Data.map(({ Users: { manner_count }, ...board }) => ({
          ...board,
          manner_count,
        }));
      return  modifiedBoard1;
    } catch (error) {
      console.error(`메인페이지 쩔 게시글 조회 에러: ${error.message}`);
    }
  }

  async getBoard2Data() {
    try{
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
        relations: ['Users']
      });
        const modifiedBoard2 = board2Data.map(({ Users: { manner_count }, ...board2 }) => ({
          ...board2,
          manner_count,
        }));
      return modifiedBoard2;
    } catch (error) {
      console.error(`메인페이지 겹사 게시글 조회 에러: ${error.message}`);
    }
  }

  async getManner3() {
    try{
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
      .filter(board => board.manner_count !== null)
      .slice(0, 3);

      return modifiedBoard
    } catch (error) {
      console.error(`메인페이지 겹사 게시글 조회 에러: ${error.message}`);
    }
  }

  // async getManner3():Promise<any> {
  //   try {
  //     const topThreeMannerPosts = await this.boardRepository
  //     .createQueryBuilder('Board')
  //     .select([
  //       'Board.board1_id',
  //       'Board.user_id',
  //       'Board.discord_id',
  //       'Board.discord_global_name',
  //       'Board.discord_image',
  //       'MAX(Users.manner_count) AS manner_count'
  //     ])
  //     .leftJoin('Board.Users', 'Users')
  //     .groupBy('Board.board1_id')
  //     .orderBy('manner_count', 'DESC')
  //     .take(3)
  //     .getRawMany();

  //   return topThreeMannerPosts.map(post => ({
  //     board1_id: post.Board_board1_id, 
  //     user_id: post.Board_user_id,
  //     discord_id: post.Board_discord_id, 
  //     discord_global_name: post.Board_discord_global_name, 
  //     discord_image: post.Board_discord_image, 
  //     manner_count: post.manner_count
  //   }));

  //   } catch (error) {
  //     console.error(`메너 게시글 3개 조회 에러: ${error.message}`);
  //   }
  // }

  // async getManner3():Promise<any> {
  //   try {

  //   } catch (error) {
  //     console.error(`메인페이지 겹사 게시글 조회 에러: ${error.message}`);
  //   }
  // }




}
