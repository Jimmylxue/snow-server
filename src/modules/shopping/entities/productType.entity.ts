import { User } from '@src/modules/admin/system/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('productType', { schema: 'snow-server' })
export class ProductType {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  /**
   * 绑定 userId
   */
  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @Column('varchar', { name: 'title', length: 45, comment: '分类标题' })
  title: string;

  @Column('varchar', { name: 'subTitle', length: 45, comment: '分类副标题' })
  subTitle: string;

  @Column('text', { name: 'desc', nullable: true, comment: '分类描述' })
  desc: string;

  @Column('text', { name: 'imgSrc', nullable: true, comment: '分类图片' })
  imgSrc: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
