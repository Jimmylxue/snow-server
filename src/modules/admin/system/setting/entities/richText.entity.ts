import { ELogicDel } from '@src/types/base';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('richtext', { schema: 'snow-server' })
export class RichText {
  @PrimaryGeneratedColumn({ type: 'int', name: 'richTextId' })
  richTextId: number;

  @Column('text', { name: 'title', comment: '文本信息' })
  title: string;

  @Column('text', { name: 'image', comment: '商品主图', nullable: true })
  image: string;

  @Column({
    type: 'enum',
    enum: ELogicDel,
    default: ELogicDel.未删除,
    name: 'logicDel',
  })
  logicDel: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
