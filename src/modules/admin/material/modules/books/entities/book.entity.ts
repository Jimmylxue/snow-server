import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TBBookType } from './bookType.entity';

@Entity('tb_books', { schema: 'snow-server' })
export class TBBooks {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ManyToOne(() => TBBookType, (bookType) => bookType.id)
  @JoinColumn({ name: 'type_id' })
  type: number;

  @Column('int', { name: 'type_id', comment: '类型id' })
  typeId: number;

  @Column('varchar', { name: 'title', length: 200 })
  name: string;

  @Column('varchar', { name: 'author', length: 200, nullable: true })
  author: string;

  @Column('text', { name: 'cover', nullable: true, comment: '封面' })
  cover: string;

  @Column('text', { name: 'description' })
  description: string;

  @Column('text', { name: 'source', comment: '资源链接' })
  source: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
