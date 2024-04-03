import { Board } from 'src/board/entities/board.entity';
import { Board2 } from 'src/board2/entities/board2.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { Party } from 'src/party/entities/party.entity';
import { Users } from 'src/users/entities/users.entity';
import { WoodCutter } from 'src/woodcutter/entities/woodcutter.entity';
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
export class Comment extends BaseModel {
  @PrimaryGeneratedColumn()
  comment_id: number;

  @Column()
  user_id: number;
  @ManyToOne(() => Users, (Users) => Users.user_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  Users: Users;

  @Column()
  comment: string;

  @Column()
  discord_id: string;

  @Column()
  discord_username: string;

  @Column({
      nullable: true,
  })
  discord_global_name: string;

  @Column()
  discord_image: string;

  @ManyToOne(() => Board, (board1) => board1.board1_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board1_id' })
  board1_id: Board;

  @ManyToOne(() => Board2, (board2) => board2.board2_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board2_id' })
  board2_id: Board2;

  @ManyToOne(() => WoodCutter, (board3) => board3.board3_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board3_id' })
  board3_id: WoodCutter;

  @ManyToOne(() => Party, (board4) => board4.board4_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board4_id' })
  board4_id: Party;

  @Column()
  board_type: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
