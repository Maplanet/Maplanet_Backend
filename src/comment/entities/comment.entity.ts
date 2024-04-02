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

  @ManyToOne(() => Board, (board1) => board1.board1_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board1_id' })
  board1: Board;

  @ManyToOne(() => Board2, (board2) => board2.board2_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board2_id' })
  board2: Board2;

  @ManyToOne(() => WoodCutter, (board3) => board3.board3_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board3_id' })
  board3: WoodCutter;

  @ManyToOne(() => Party, (board4) => board4.board4_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'board4_id' })
  board4: Party;

  @Column()
  board_type: string;
}
