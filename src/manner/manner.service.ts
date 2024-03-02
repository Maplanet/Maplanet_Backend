import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { Manner } from './entities/manner.entity';

@Injectable()
export class MannerService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        @InjectRepository(Manner)
        private readonly mannerRepository: Repository<Manner>,
      ) {}

    async mannerUser(myUserId: any, user_id: any): Promise<any> {
        try{
            const user = await this.usersRepository.findOne({ where: { user_id } });
        
            if (!user) {
            throw new Error('유저를 찾을 수 없습니다.')
            }
            
            const manner = await this.mannerRepository.findOne({
                where: {
                    manner_user_id: myUserId.user_id,
                    mannered_user_id: user_id
                }
            })

            if(myUserId.user_id !== user.user_id) {
                if (!manner) {
                    const manners = await this.mannerRepository.create({
                        manner_user_id: myUserId.user_id,
                        mannered_user_id: user_id
                    })
                    await this.mannerRepository.save(manners);
                    user.manner_count++;
                    await this.usersRepository.save(user);
                    return '유저 매너지수를 1 높였습니다.';
                } else {
                    await this.mannerRepository.delete(manner);
                    user.manner_count--;
                    await this.usersRepository.save(user);
                    return '유저 매너지수를 1 낮췄습니다.';
                }
            } else {
                throw new Error ('자기 자신의 매너지수를 높일 수 없습니다.')
            }
        } catch (error) {
            throw new HttpException(
                {
                    status: 401,
                    error: {
                    message: '매너지수 등록 에러',
                    detail: error.message,
                    },
                },
                401,
            );
        }
    }
}
