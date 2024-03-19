import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from './entities/administrator.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Administrator)
    private readonly AdminRepository: Repository<Administrator>,
  ) {}

  async findAdminUser(user_id: string) {
    return await this.AdminRepository.findOne({
      where: { user_id },
    });
  }
}
