import { ELogicDel } from '@src/types/base';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LinkPlatform } from './linkPlatform.entity';

export enum ELinkType {
  淘宝 = 1,
  亚马逊,
}

@Entity('link', { schema: 'snow-server' })
export class Link {
  @PrimaryGeneratedColumn({ type: 'int', name: 'linkId' })
  linkId: number;

  @Column('varchar', { name: 'title', length: 768, comment: '商品信息' })
  title: string;

  @Column('text', { name: 'mainImage', comment: '商品主图' })
  mainImage: string;

  @Column('text', { name: 'fullLink', comment: '完整链接' })
  fullLink: string;

  @Column('int', { name: 'price', comment: '商品价格' })
  price: number;

  @Column('int', { name: 'coin', comment: '金币', nullable: true, default: 1 })
  coin: number;

  @Column('int', {
    name: 'visitTime',
    comment: '浏览时间',
    nullable: true,
    default: 15,
  })
  visitTime: number;

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

  @Column({ type: 'int', name: 'linkType' })
  linkTypeId: number;

  // 当letter表的 letterId删除之后 这边会同步一起删除掉
  // @ManyToOne(() => LinkPlatform, (linkPlatform) => linkPlatform.linkTypeId, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'linkType' })
  // linkType: number;
}
