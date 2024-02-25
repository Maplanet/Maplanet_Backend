import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, UpdateResult } from 'typeorm';
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
                    'user_id',
                    'board2_id',
                    'discord_id',
                    'meso',
                    'report_kind',
                    'title',
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
                },
                relations: ['Users']
            })
        const modifiedBoard1 = board2.map(({ Users: { report_count, manner_count }, ...board2 }) => ({
            ...board2,
            report_count,
            manner_count,
        }));
        return { board1Data: modifiedBoard1 };
        } catch (error) {
        console.error(`쩔 게시글 조회 에러: ${error.message}`);
        }
    }

    async board2ViewCount(board2_id: number): Promise<UpdateResult> {
        return await this.board2Repository.update({ board2_id }, {view_count: () => 'view_count + 1'});
      }

    async board2DetailInfo(board2_id: number):Promise<any> {
        try{
        const board2DetailInfo = await this.board2Repository.findOne({
            where: {board2_id},
            select: [
              'user_id',
              'board2_id',
              'discord_id',
              'meso',
              'title',
              'report_kind',
              'request_nickname',
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
            relations: ['Users']
        });
        await this.board2ViewCount(board2_id);
    
        const { Users: { report_count, manner_count }, ...board2 } = board2DetailInfo;
    
        return {
                ...board2,
                report_count,
                manner_count,
            }
        } catch (error) {
            console.error(`쩔 게시글 상세 조회 에러: ${error.message}`);
        }
      }

    async board2SearchInfo(
        page: number = 1, 
        searchMeso: number,
        searchReportKind: string,
        searchTitle: string,
        searchRequestNickname: string,
        searchPlaceTheifNickname: string,
        searchDiscordName: string,
        ): Promise<any> {
        try{
            const limit = 5;
            const skip = (page - 1) * limit;
            const take = limit;

            const searchedBoard2 = await this.board2Repository.find({
                where: [
                    { meso: searchMeso },
                    { report_kind: Like(`%${searchReportKind}%`) },
                    { title: Like(`%${searchTitle}%`) },
                    { request_nickname: Like(`%${searchRequestNickname}%`) },
                    { place_theif_nickname: Like(`%${searchPlaceTheifNickname}%`) },
                    { discord_global_name: Like(`%${searchDiscordName}%`) },
                ],
                select: [
                    'user_id',
                    'board2_id',
                    'discord_id',
                    'meso',
                    'report_kind',
                    'title',
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
                },
                relations: ['Users']
            })

        const modifiedSearchBoard2 = searchedBoard2.map(({ Users: { report_count, manner_count }, ...board2 }) => ({
            ...board2,
            report_count,
            manner_count,
            }));
    
            return { search2Data: modifiedSearchBoard2 };
        } catch (error) {
            console.error(`쩔 게시글 검색 조회 에러: ${error.message}`);
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
