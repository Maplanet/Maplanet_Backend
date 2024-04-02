import { Test, TestingModule } from '@nestjs/testing';
import { ChildcommentController } from './childcomment.controller';
import { ChildcommentService } from './childcomment.service';

describe('ChildcommentController', () => {
  let controller: ChildcommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildcommentController],
      providers: [ChildcommentService],
    }).compile();

    controller = module.get<ChildcommentController>(ChildcommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
