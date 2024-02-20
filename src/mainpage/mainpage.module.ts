import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from 'src/board/entities/board.entity';
import { Board2 } from 'src/board2/entities/board2.entity';
import { UsersModule } from 'src/users/users.module';
import { MainpageController } from './mainpage.controller';
import { MainpageService } from './mainpage.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Board]), 
        TypeOrmModule.forFeature([Board2]), 
        UsersModule
    ],
    controllers: [MainpageController],
    providers: [MainpageService]
})
export class MainpageModule {}
