import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Board } from 'src/board/entities/board.entity';
import { Board2 } from 'src/board2/entities/board2.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Board, Board2]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
