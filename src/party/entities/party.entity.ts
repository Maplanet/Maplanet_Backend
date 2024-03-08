import { Users } from 'src/users/entities/users.entity';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Party {
    @PrimaryGeneratedColumn()
    board4_id: number;

    @Column()
    user_id: number;
    @ManyToOne(() => Users, (Users) => Users.user_id ,{
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'user_id' })
    Users: Users;

    @Column()
    discord_id: string;

    @Column()
    title: string;

    @Column()
    hunting_ground: string;

    @Column()
    recruit_people_count: number;

    @Column()
    maple_server: string;

    @Column()
    maple_nickname: string;

    @Column()
    progress_time: number;

    @Column()
    parking: boolean;

    @Column()
    first_floor: string;

    @Column()
    second_floor: string;

    @Column()
    third_floor: string;

    @Column()
    fourth_floor: string;

    @Column()
    fifth_floor: string;

    @Column()
    sixth_floor: string;
    
    @Column()
    discord_username: string;

    @Column()
    discord_global_name: string;

    @Column()
    discord_image: string;

    @Column()
    view_count: number;

    @Column()
    complete: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

}