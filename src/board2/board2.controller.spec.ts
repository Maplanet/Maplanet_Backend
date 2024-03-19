import { Test, TestingModule } from '@nestjs/testing';
import { Board2Controller } from './board2.controller';
import { Board2Service } from './board2.service';

describe('Board2Controller', () => {
  let controller: Board2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Board2Controller],
      providers: [Board2Service],
    }).compile();

    controller = module.get<Board2Controller>(Board2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
