import { Test, TestingModule } from '@nestjs/testing';
import { MainpageController } from './mainpage.controller';

describe('MainpageController', () => {
  let controller: MainpageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainpageController],
    }).compile();

    controller = module.get<MainpageController>(MainpageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
