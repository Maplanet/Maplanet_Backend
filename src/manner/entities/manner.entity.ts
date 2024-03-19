import { Users } from 'src/users/entities/users.entity';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, } from 'typeorm'

@Entity()
export class Manner {
    @PrimaryGeneratedColumn()
    manner_id: number;
    
    @Column()
    manner_user_id: number;
    @ManyToOne(() => Users, (Users) => Users.manners_mannered ,{
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'manner_user_id' })
    manners: Users;

    @Column()
    mannered_user_id: number;

}