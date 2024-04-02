import { Test, TestingModule } from '@nestjs/testing';
import { ChildcommentService } from './childcomment.service';

describe('ChildcommentService', () => {
  let service: ChildcommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChildcommentService],
    }).compile();

    service = module.get<ChildcommentService>(ChildcommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
