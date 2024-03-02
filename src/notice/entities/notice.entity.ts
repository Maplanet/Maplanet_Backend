import { IsString } from 'class-validator';
import { Administrator } from 'src/administrator/entities/administrator.entity';
import { stringValidationMessage } from 'src/common/string-validation.message';
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
export class Notice {
  @PrimaryGeneratedColumn()
  notice_id: number;

  @Column()
  administrator_id: number;

  @ManyToOne(
    () => Administrator,
    (Administrator) => Administrator.administrator_id,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'administrator_id' })
  Administrators: Administrator;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  title: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  category: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  content: string;

  @Column()
  writer: string;

  @Column()
  view_count: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
