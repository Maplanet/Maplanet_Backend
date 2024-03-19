import { Test, TestingModule } from '@nestjs/testing';
import { MannerController } from './manner.controller';

describe('MannerController', () => {
  let controller: MannerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MannerController],
    }).compile();

    controller = module.get<MannerController>(MannerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
