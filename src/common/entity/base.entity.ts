import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseModel {
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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
