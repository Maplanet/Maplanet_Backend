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
    discord_id: string;

    @Column()
    meso: number;

    @Column()
    title: string;

    @Column()
    maple_nickname: string;

    @Column()
    level: number;

    @Column()
    main_job: string;

    @Column()
    sub_job: string;

    @Column()
    progress_time: number;

    @Column()
    position: boolean;
    
    @Column()
    discord_username: string;

    @Column({
        nullable: true,
    })
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