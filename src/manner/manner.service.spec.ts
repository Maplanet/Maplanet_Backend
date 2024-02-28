import { Test, TestingModule } from '@nestjs/testing';
import { MannerService } from './manner.service';

describe('MannerService', () => {
  let service: MannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MannerService],
    }).compile();

    service = module.get<MannerService>(MannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
