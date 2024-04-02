import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async createComment(user_id, createCommentDto): Promise<Comment> {
    const obj = this.commentRepository.create(createCommentDto);
    return this.commentRepository.save(createCommentDto);
  }
}
