import { Test, TestingModule } from '@nestjs/testing';
import { WoodcutterService } from './woodcutter.service';

describe('WoodcutterService', () => {
  let service: WoodcutterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WoodcutterService],
    }).compile();

    service = module.get<WoodcutterService>(WoodcutterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
