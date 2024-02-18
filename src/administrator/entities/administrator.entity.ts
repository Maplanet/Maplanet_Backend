import { Notice } from 'src/notice/entities/notice.entity';
import { Users } from 'src/users/entities/users.entity';
import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm'

@Entity()
export class Administrator {
    @PrimaryGeneratedColumn()
    administrator_id: number;

    @Column()
    user_id: number;

    @OneToOne(() => Users, (Users) => Users.user_id ,{
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'user_id' })
    Users: Users;

    @Column()
    role: string;

    @OneToMany(() => Notice, (notice) => notice.Administrators, {  cascade: true })
    notices: Notice[];
}