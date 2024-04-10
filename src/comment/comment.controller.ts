import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorators/user.decorator';
import { Comment } from 'src/comment/entities/comment.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Board } from 'src/board/entities/board.entity';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('/board1/:board1_id/comment')
  @ApiOperation({
    summary: 'board1 댓글 조회',
    description: 'board1 댓글 조회',
  })
  @ApiResponse({ status: 200, description: 'board1 댓글 조회' })
  async boardInfo(
    @Req() Req,
    @Param('board1_id') board1_id: Board,
  ): Promise<any> {
    console.log(Req.HostParam);
    console.log(Req.hosts);
    const getCommentInfo =
      await this.commentService.commentInfoBoard1(board1_id);
    return { commentBoard1Data: getCommentInfo };
  }

  @ApiOperation({
    summary: 'board1 댓글 등록',
    description: 'board1댓글 등록하기',
  })
  @ApiResponse({
    status: 201,
    description: 'board1 comment 등록',
  })
  @UseGuards(AccessTokenGuard)
  @Post('/board1/:board1_id/comment')
  async postCommentBoard1(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
    @Param('board1_id') board1_id: any,
  ): Promise<any> {
    const user = req.user;
    const getCommentInfo = await this.commentService.postCommentBoard1(
      createCommentDto,
      user,
      board1_id,
    );
    console.log(createCommentDto);
    return getCommentInfo;
  }

  @ApiOperation({
    summary: 'board1 댓글 삭제',
    description: 'board1 댓글 삭제',
  })
  @ApiResponse({ status: 200, description: 'board1 댓글 삭제' })
  @UseGuards(AccessTokenGuard)
  @Delete('/board1/:board1_id/comment/:comment_id')
  async board1Delete(
    @Req() req,
    @Param('board1_id') board1_id: any,
    @Param('comment_id') comment_id: any,
  ): Promise<any> {
    const user = req.user;
    const deleteCommentInfo = await this.commentService.board1Delete(
      board1_id,
      comment_id,
      user,
    );
    return deleteCommentInfo;
  }
}
