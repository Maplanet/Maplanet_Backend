import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,

      ) {}
    
    async reportUser(myUserId: any, user_id: any): Promise<any> {
        const user = await this.usersRepository.findOne({ where: { user_id } });
    
        if (!user) {
          throw new Error('유저를 찾을 수 없습니다.')
        }
        
        const report = await this.reportRepository.findOne({
            where: {
                reporter_user_id: myUserId,
                reported_user_id: user_id
            }
        })
        if (myUserId !== user.user_id) {
            if (!report) {
                const reports = await this.reportRepository.create({
                    reporter_user_id: myUserId,
                    reported_user_id: user_id
                })
                await this.reportRepository.save(reports);
                user.report_count++;
                await this.usersRepository.save(user);
                return '유저를 신고하였습니다.';
            } else {
                await this.reportRepository.delete(report);
                user.report_count--;
                await this.usersRepository.save(user);
                return '유저를 신고하기를 취소하였습니다.';
            }
        } else {
            return '자기 자신을 신고할 수 없습니다.'
        }
    }
}
