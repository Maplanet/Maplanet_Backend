import { Test, TestingModule } from '@nestjs/testing';
import { MainpageService } from './mainpage.service';

describe('MainpageService', () => {
  let service: MainpageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainpageService],
    }).compile();

    service = module.get<MainpageService>(MainpageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
