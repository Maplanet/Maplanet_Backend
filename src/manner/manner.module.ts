import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Manner } from './entities/manner.entity';
import { MannerController } from './manner.controller';
import { MannerService } from './manner.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Manner])],
  controllers: [MannerController],
  providers: [MannerService]
})
export class MannerModule {}
