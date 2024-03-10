import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WoodcutterService } from './woodcutter.service';
import { AuthGuard } from '@nestjs/passport';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { WoodCutterDTO } from './dto/postWoodCutter.dto';
import { IBoard3Data, IWoodCutter } from './interface/woodcutter.interfacte';
import { WoodCutter } from './entities/woodcutter.entity';
import { pipe } from 'rxjs';

@Controller('board3')
export class WoodcutterController {
  constructor(private readonly woodcutterService: WoodcutterService) {}

  @Post('post')
  @UseGuards(AccessTokenGuard)
  async createWoodCutter(
    @Body() woodCutterDTO: WoodCutterDTO,
  ): Promise<IWoodCutter> {
    console.log(woodCutterDTO);
    return await this.woodcutterService.createWoodCutter(woodCutterDTO);
  }

  @Get()
  async getAllWoodCutter() {
    return await this.woodcutterService.getAllWoodCutter();
  }
}
