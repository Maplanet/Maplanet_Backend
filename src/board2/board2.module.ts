import { Module } from '@nestjs/common';
import { Board2Service } from './board2.service';
import { Board2Controller } from './board2.controller';

@Module({
  controllers: [Board2Controller],
  providers: [Board2Service],
})
export class Board2Module {}
