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

export enum EOrderStatus {
  已下单 = 1,
  已发货,
  已完成,
  已退款,
}

@Entity('address', { schema: 'snow-server' })
export class Address {
  @PrimaryGeneratedColumn({ type: 'int', name: 'addressId' })
  addressId: number;

  /**
   * 绑定 userId
   */
  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @Column('varchar', { name: 'province', length: 45, comment: '省' })
  province: string;

  @Column('varchar', { name: 'city', length: 45, comment: '市' })
  city: string;

  @Column('varchar', { name: 'area', length: 45, comment: '区' })
  area: string;

  @Column('text', { name: 'detail', nullable: true, comment: '详情地址' })
  detail: string;

  @Column('varchar', { name: 'username', length: 45, comment: '市' })
  username: string;

  @Column('varchar', { name: 'phone', length: 45, comment: '市' })
  phone: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
