import { Test, TestingModule } from '@nestjs/testing';
import { Board2Service } from './board2.service';

describe('Board2Service', () => {
  let service: Board2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Board2Service],
    }).compile();

    service = module.get<Board2Service>(Board2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
