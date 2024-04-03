import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Comment } from '../entities/comment.entity';

export class CreateCommentDto extends PickType(Comment, ['comment']) {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
      example: '파티사냥 들어갈게요',
      description: '댓글',
    })
    public comment: string;
}
