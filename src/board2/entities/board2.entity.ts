import { Users } from 'src/users/entities/users.entity';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Board2 {
    @PrimaryGeneratedColumn()
    board2_id: number;

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
    report_kind: string;

    @Column()
    title: string;

    @Column()
    request_nickname: string;

    @Column()
    place_theif_nickname: string;

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