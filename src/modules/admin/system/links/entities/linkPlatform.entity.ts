import { ELogicDel } from '@src/types/base';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ELinkOpenStatus {
  开放 = 1,
  关闭,
}

@Entity('linkplatform', { schema: 'snow-server' })
export class LinkPlatform {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'linkTypeId',
  })
  linkTypeId: number;

  @Column('varchar', { name: 'title', length: 768, comment: '链接平台名称' })
  name: string;

  @Column({
    type: 'enum',
    enum: ELinkOpenStatus,
    default: ELinkOpenStatus.开放,
    name: 'openStatus',
  })
  openStatus: number;

  @Column({
    type: 'enum',
    enum: ELogicDel,
    default: ELogicDel.未删除,
    name: 'logicDel',
  })
  logicDel: number;

  @Column('text', { name: 'mainImage', comment: 'link类型的图片' })
  mainImage: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;

  // @OneToMany(() => Link, (link) => link.linkType)
  // links: Link[];
}
