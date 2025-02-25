import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tb_book_type', { schema: 'snow-server' })
export class TBBookType {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 200 })
  name: string;

  @Column('text', { name: 'cover', nullable: true, comment: '封面素材' })
  cover: string;

  @Column('text', { name: 'description', nullable: true })
  description: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
