import { Test, TestingModule } from '@nestjs/testing';
import { WoodcutterController } from './woodcutter.controller';

describe('WoodcutterController', () => {
  let controller: WoodcutterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WoodcutterController],
    }).compile();

    controller = module.get<WoodcutterController>(WoodcutterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
