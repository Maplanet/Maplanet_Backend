import { Controller } from '@nestjs/common';
import { Board2Service } from './board2.service';

@Controller('board2')
export class Board2Controller {
  constructor(private readonly board2Service: Board2Service) {}
}
