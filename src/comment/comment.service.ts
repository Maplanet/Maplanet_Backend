import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/board/entities/board.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/createComment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Board)
    private board1Repository: Repository<Board>
  ) {}

  async commentInfoBoard1(board1_id: Board): Promise<any> {
    try {
      const board1Comment = await this.commentRepository.find({
        where: { board1_id },
        select: [
          'comment_id',
          'user_id',
          'board1_id',
          'discord_id',
          'discord_global_name',
          'discord_image',
          'comment',
          'created_at',
          'updated_at',
        ],
        order: {
          created_at: 'DESC',
        },
        relations: ['Users'],
      });

      const modifiedBoard1Comment = board1Comment.map(
        ({ Users: { report_count, manner_count }, ...board1Comment }) => ({
          ...board1Comment,
          report_count,
          manner_count,
        }),
      );
      return modifiedBoard1Comment;
    } catch (error) {
      throw new HttpException(
        {
          status: 400,
          error: {
            message: 'board1 댓글 조회 에러',
            detail: error.message,
          },
        },
        400,
      );
    }
  }

  async postCommentBoard1(createCommentDto: CreateCommentDto, user: any, board1_id: any): Promise<any> {
    try {
      const {
        comment
      } = createCommentDto;

      const createComment = this.commentRepository.create({
        user_id: user.user_id,
        board1_id,
        comment,
        discord_id: user.discord_id,
        discord_username: user.username,
        discord_global_name: user.global_name,
        discord_image: user.avatar,
      });

      await this.commentRepository.save(createComment);
      return { msg: '댓글 등록이 완료되었습니다.' };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: 401,
          error: {
            message: '댓글 등록 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  }

  async board1Delete(board1_id: any, comment_id: any, user: any): Promise<any> {
    try {
      // const board1 = await this.board1Repository.findOne(board1_id)
      const comment = await this.commentRepository.findOne({
        where: { board1_id, comment_id }
      });
      // if (!board1) {
      //   throw new Error('해당 게시물을 찾을 수 없습니다.');
      // }

      if (!comment) {
        throw new Error('해당 댓글을 찾을 수 없습니다.');
      } 

      if (comment.user_id !== user.user_id) {
        throw new Error('댓글을 삭제할 권한이 없습니다.');
      }

      await this.commentRepository.delete({ comment_id });
      
      return { msg: '댓글 삭제가 완료되었습니다.' };
    }catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: 401,
          error: {
            message: '댓글 삭제 에러',
            detail: error.message,
          },
        },
        401,
      );
    }
  }


}
