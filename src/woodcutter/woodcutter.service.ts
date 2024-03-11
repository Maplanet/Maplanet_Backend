import { Injectable } from '@nestjs/common';
import { WoodCutter } from './entities/woodcutter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBoard3Data, IWoodCutter } from './interface/woodcutter.interfacte';
import { WoodCutterDTO } from './dto/postWoodCutter.dto';

@Injectable()
export class WoodcutterService {
  constructor(
    @InjectRepository(WoodCutter)
    private readonly woodCutterRepository: Repository<WoodCutter>,
  ) {}

  async createWoodCutter(woodCutterDTO: IWoodCutter): Promise<IWoodCutter> {
    this.woodCutterRepository.create(woodCutterDTO);
    return await this.woodCutterRepository.save(woodCutterDTO);
  }

  async getAllWoodCutter() {
    return await this.woodCutterRepository.find();
  }

  /**
   * 특정 유저 조회
   * @param id
   */
}
