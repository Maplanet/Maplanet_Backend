import { HttpException, Injectable } from '@nestjs/common';
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
        try {
            const user = await this.usersRepository.findOne({ where: { user_id } });
        
            if (!user) {
            throw new Error('유저를 찾을 수 없습니다.')
            }
            
            const report = await this.reportRepository.findOne({
                where: {
                    reporter_user_id: myUserId.user_id,
                    reported_user_id: user_id
                }
            })
            if (myUserId.user_id !== user.user_id) {
                if (!report) {
                    const reports = await this.reportRepository.create({
                        reporter_user_id: myUserId.user_id,
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
                throw new Error ('자기 자신을 신고할 수 없습니다.')
            }
        }   catch (error) {
            throw new HttpException(
                {
                    status: 401,
                    error: {
                    message: '유저 신고 에러',
                    detail: error.message,
                    },
                },
                401,
            );
        }
    }
}
