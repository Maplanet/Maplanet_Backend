import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Users } from 'src/users/entities/users.entity';
import { UsersModule } from 'src/users/users.module';
import { Party } from './entities/party.entity';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';

@Module({
  imports: [TypeOrmModule.forFeature([Party, Users]),UsersModule, AuthModule],
  controllers: [PartyController],
  providers: [PartyService]
})
export class PartyModule {}
