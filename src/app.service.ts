import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board/entities/board.entity';
import { Board2 } from './board2/entities/board2.entity';
import { ConfigService } from '@nestjs/config';

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
    const board1Data = await this.boardRepository.find({
      select: [
        'board1_id',
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
      // 매너카운트 추가 필요
      order: {
        created_at: 'DESC',
      },
      take: 3,
    });
    return board1Data;
  }

  async getBoard2Data() {
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
        // 매너카운트 추가 필요
      ],
      order: {
        created_at: 'DESC',
      },
      take: 3,
    });

    return board2Data;
  }
}
