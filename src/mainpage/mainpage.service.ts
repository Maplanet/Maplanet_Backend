import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/board/entities/board.entity';
import { Board2 } from 'src/board2/entities/board2.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MainpageService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
        @InjectRepository(Board2)
        private board2Repository: Repository<Board2>
    ){}

    // async getMainpage(): Promise<any> {
    //     try{
    //         const board1 = await this.boardRepository.find({
    //             select: [

    //             ]
    //         })

    //     } catch (error) {
    //         console.error(`잠쩔 게시글 조회 에러: ${error.message}`);
    //     }
    // } 

}
