import { Users } from 'src/users/entities/users.entity';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    board1_id: number;

    @Column()
    discord_id: string;

    @ManyToOne(() => Users, (Users) => Users.discord_id ,{
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'discord_id' })
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
    main_job: string;

    @Column()
    sub_job: string;

    @Column()
    progress_kind: string;

    @Column()
    progress_time: string;

    @Column()
    position: boolean;
    
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