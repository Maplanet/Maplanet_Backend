import { Module } from '@nestjs/common';
import { ChildcommentService } from './childcomment.service';
import { ChildcommentController } from './childcomment.controller';

@Module({
  controllers: [ChildcommentController],
  providers: [ChildcommentService],
})
export class ChildcommentModule {}
