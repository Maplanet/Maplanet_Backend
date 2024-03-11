import { Users } from 'src/users/entities/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WoodCutter {
  @PrimaryGeneratedColumn()
  board3_id: number;

  @Column({ type: 'int' })
  user_id: number;
  @ManyToOne(() => Users, (Users) => Users.user_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  Users: Users;

  @Column({ type: 'char', length: 20 })
  discord_id: string;

  @Column({ type: 'int' })
  meso: number;

  @Column({ type: 'varchar', length: 20 })
  title: string;

  @Column({ type: 'varchar', length: 20 })
  hunting_ground: string;

  @Column({ type: 'varchar', length: 20 })
  main_job: string;

  @Column({ type: 'varchar', length: 20 })
  sub_job: string;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'varchar', length: 10 })
  maple_nickname: string;

  @Column({ type: 'int' })
  progress_time: number;

  @Column({ type: 'varchar', length: 10 })
  discord_username: string;

  @Column({ type: 'varchar', nullable: true })
  discord_global_name: string;

  @Column({ type: 'varchar' })
  discord_image: string;

  @Column({ type: 'int' })
  view_count: number;

  @Column({ type: 'boolean' })
  complete: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
