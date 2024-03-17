import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Users } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';
import { Manner } from './entities/manner.entity';
import { MannerController } from './manner.controller';
import { MannerService } from './manner.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Manner]),
    UsersModule,
    AuthModule,
    HttpModule,
  ],
  controllers: [MannerController],
  providers: [MannerService],
})
export class MannerModule {}
