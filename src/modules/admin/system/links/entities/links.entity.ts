import { ELogicDel } from '@src/types/base';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('link', { schema: 'snow-server' })
export class Link {
  @PrimaryGeneratedColumn({ type: 'int', name: 'linkId' })
  linkId: number;

  @Column('varchar', { name: 'title', length: 768 })
  title: string;

  @Column('text', { name: 'mainImage' })
  mainImage: string;

  @Column('text', { name: 'fullLink' })
  fullLink: string;

  @Column('int', { name: 'price' })
  price: number;

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
