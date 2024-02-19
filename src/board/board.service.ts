import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>
    ) {}

    async boardInfo(page: number = 1): Promise<any> {
        try {
            const limit = 5;
            const skip = (page - 1) * limit;
            const take = limit;

            const board = await this.boardRepository.find({
                select: [
                    'board1_id',
                    'user_id',
                    'meso',
                    'title',
                    'maple_nickname',
                    'hunting_ground',
                    'level',
                    'job',
                    'progress_time',
                    'discord_nickname',
                    'discord_image',
                    'view_count',
                    'complete',
                    'created_at',
                    'updated_at'
                ],
                skip,
                take
            })
            return board
        } catch {
  
        }
    }
}
