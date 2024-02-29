import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Like, Repository, UpdateResult } from 'typeorm';
import { CreateBoard2Dto } from './dto/create-board2.dto';
import { Board2 } from './entities/board2.entity';

@Injectable()
export class Board2Service {
    constructor(
        @InjectRepository(Board2)
        private board2Repository: Repository<Board2>,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) {}

    async board2Info(page: number = 1): Promise<any> {
        try {
            const limit = 8;
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
                    created_at: 'DESC' 
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
            const limit = 8;
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

    async postBoard2(createBoard2Dto: CreateBoard2Dto, user): Promise<any> {
        try {
            const { 
                meso,
                report_kind,
                title,
                request_nickname,
                place_theif_nickname
            } = createBoard2Dto;

            const createBoard2 = this.board2Repository.create({
              user_id: user.user_id,
              meso,
              report_kind,
              title,
              request_nickname,
              place_theif_nickname,
              discord_id: user.discord_id,
              discord_username: user.username,
              discord_global_name: user.global_name,
              discord_image: user.avatar,
            })

            await this.board2Repository.save(createBoard2)
            return {msg: '겹사 게시글 등록이 완료되었습니다.'}
        } catch (error) {
            console.error(`겹사 게시글 등록 에러: ${error.message}`);
        }
    } 

    async completeBoard2(board2_id: number, user_id: number): Promise<any> {
        try{
          const board2 = await this.board2Repository.findOne({
            where: {
                board2_id,
            }
          });

          const user = await this.usersRepository.findOne({
            where: {
              user_id: user_id
            }
          })
    
          if(!board2) {
            throw new NotFoundException('게시글이 존재하지 않습니다.');
          }
    
          // if(board2.user_id !== user_id) {
          //   throw new NotFoundException('다른 사람이 작성한 게시글에 완료처리를 할 수 없습니다.')
          // }
    
          if (board2.user_id === user.user_id){
            if (!board2.complete) {
              board2.complete = true;
              user.progress_count += 1;
              await this.usersRepository.save(user)
            } else {
              board2.complete = false;
              user.progress_count -= 1;
              await this.usersRepository.save(user)
            }
      
            await this.board2Repository.save(board2);
      
            if (board2.complete) {
              return '게시글을 완료하였습니다.';
            } else {
              return '게시글의 완료를 취소하였습니다.';
            }  
          } else {
            return '자신의 게시글만 완료처리 할 수 있습니다.'
          }
        } catch (error) {
          console.error(`겹사 게시글 완료 에러: ${error.message}`);
        }
      } 
}
