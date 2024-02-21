import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateBoard2Dto } from './dto/create-board2.dto';
import { Board2 } from './entities/board2.entity';

@Injectable()
export class Board2Service {
    constructor(
        @InjectRepository(Board2)
        private board2Repository: Repository<Board2>
    ) {}

    async board2Info(page: number = 1): Promise<any> {
        try {
            const limit = 5;
            const skip = (page - 1) * limit;
            const take = limit;

            const board2 = await this.board2Repository.find({
                select: [
                    'board2_id',
                    'discord_id',
                    'meso',
                    'report_kind',
                    'title',
                    'request_nickname',
                    'place_theif_nickname',
                    //'discord_id'
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
            return {board2Data: board2}
        } catch (error) {
            console.error(`겹사 게시글 조회 에러: ${error.message}`);
        }
    }

    async board2SearchInfo(page: number = 1, search: any): Promise<any> {
        try{
            const limit = 5;
            const skip = (page - 1) * limit;
            const take = limit;

            const searchedBoard = await this.board2Repository.find({
                where: [
                    { meso: search },
                    { report_kind: Like(`%${search}%`) },
                    { title: Like(`%${search}%`) },
                    { request_nickname: Like(`%${search}%`) },
                    { place_theif_nickname: Like(`%${search}%`) },
                    { discord_global_name: Like(`%${search}%`) },
                ],
                select: [
                    'board2_id',
                    'discord_id',
                    'meso',
                    'report_kind',
                    'title',
                    'request_nickname',
                    'place_theif_nickname',
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

            return {board2Data: searchedBoard}
        } catch (error) {
            console.error(`겹사 게시글 검색 조회 에러: ${error.message}`);
        }
    }

    async postBoard2(createBoard2Dto: CreateBoard2Dto): Promise<any> {
        try {
            const { 
                meso,
                report_kind,
                title,
                request_nickname,
                place_theif_nickname
            } = createBoard2Dto;

            const createBoard2 = this.board2Repository.create({
                // user_id,
                // board1_id,
                meso,
                report_kind,
                title,
                request_nickname,
                place_theif_nickname,
                // discord_id,
                // discord_username,
                // discord_global_name,
                // discord_image,
                // view_count,
                // complete
            })

            await this.board2Repository.save(createBoard2)
            return {msg: '겹사 게시글 등록이 완료되었습니다.'}
        } catch (error) {
            console.error(`겹사 게시글 등록 에러: ${error.message}`);
        }
    } 
}
