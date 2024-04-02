import { Controller } from '@nestjs/common';
import { ChildcommentService } from './childcomment.service';

@Controller('childcomment')
export class ChildcommentController {
  constructor(private readonly childcommentService: ChildcommentService) {}
}
