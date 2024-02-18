import { Users } from 'src/users/entities/users.entity';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    board1_id: number;

    @Column()
    user_id: number;

    @ManyToOne(() => Users, (Users) => Users.user_id ,{
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'user_id' })
    Users: Users;

    @Column()
    meso: number;

    @Column()
    title: string;

    @Column()
    maple_nickname: string;

    @Column()
    hunting_ground: string;

    @Column()
    level: number;

    @Column()
    job: string;

    @Column()
    progress_time: string;

    @Column()
    position: boolean;
    
    @Column()
    discord_nickname: string;

    @Column()
    discord_image: string;

    @Column()
    view_count: number;

    @Column()
    complete: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

}