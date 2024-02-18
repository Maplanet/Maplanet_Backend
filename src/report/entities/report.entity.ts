import { Users } from 'src/users/entities/users.entity';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, } from 'typeorm'

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    report_id: number;
    
    @Column()
    reporter_user_id: number;

    @ManyToOne(() => Users, (Users) => Users.reports_reported ,{
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'reporter_user_id' })
    reporter: Users;

    @Column()
    reported_user_id: number;

    @ManyToOne(() => Users, (Users) => Users.reports_reporter ,{
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'reported_user_id' })
    reported: Users;

}