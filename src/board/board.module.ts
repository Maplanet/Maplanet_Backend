import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from 'src/common/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Board]),UsersModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
