import { Injectable } from '@nestjs/common';
import { Equal, Like, Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBoardDto } from './dto/create-board.dto';

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

            const board1 = await this.boardRepository.find({
                select: [
                    'board1_id',
                    'discord_id',
                    'meso',
                    'title',
                    'maple_nickname',
                    'hunting_ground',
                    'level',
                    'job',
                    'progress_time',
                    'discord_global_name',
                    'discord_image',
                    'view_count',
                    'complete',
                    'created_at',
                    'updated_at'
                ],
                skip,
                take,
                order: {
                    created_at: 'DESC' // Order by created_at timestamp in descending order
                }
            })
            return {board1Data: board1}
        } catch (error) {
            console.error(`잠쩔 게시글 조회 에러: ${error.message}`);
        }
    }

    async boardSearchInfo(page: number = 1, search: any): Promise<any> {
        try{
            const limit = 5;
            const skip = (page - 1) * limit;
            const take = limit;

            const searchedBoard = await this.boardRepository.find({
                where: [
                    { meso: search },
                    { title: Like(`%${search}%`) },
                    { maple_nickname: Like(`%${search}%`) },
                    { hunting_ground: Like(`%${search}%`) },
                    { level: search },
                    { job: Like(`%${search}%`) },
                    { progress_time: Like(`%${search}%`) },
                    { discord_global_name: Like(`%${search}%`) }
                ],
                select: [
                    'board1_id',
                    'discord_id',
                    'meso',
                    'title',
                    'maple_nickname',
                    'hunting_ground',
                    'level',
                    'job',
                    'progress_time',
                    'discord_global_name',
                    'discord_image',
                    'view_count',
                    'complete',
                    'created_at',
                    'updated_at'
                ],
                skip,
                take,
                order: {
                    created_at: 'DESC' // Order by created_at timestamp in descending order
                }
            })

            return {board1Data: searchedBoard}
        } catch (error) {
            console.error(`잠쩔 게시글 검색 조회 에러: ${error.message}`);
        }
    }

    async postBoard(createBoardDto: CreateBoardDto): Promise<any> {
        try {
            const { 
                meso, 
                title, 
                maple_nickname, 
                hunting_ground, 
                level, 
                job, 
                progress_time, 
                position 
            } = createBoardDto;

            const createBoard1 = this.boardRepository.create({
                // user_id,
                // board1_id,
                meso,
                title,
                maple_nickname,
                hunting_ground,
                level,
                job,
                progress_time,
                position,
                // discord_id,
                // discord_username,
                // discord_global_name,
                // discord_image,
                // view_count,
                // complete
            })

            await this.boardRepository.save(createBoard1)
            return {msg: '잠쩔 게시글 등록이 완료되었습니다.'}
        } catch (error) {
            console.error(`잠쩔 게시글 등록 에러: ${error.message}`);
        }
    } 
}
