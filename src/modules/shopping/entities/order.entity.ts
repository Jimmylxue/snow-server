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

@Entity('order', { schema: 'snow-server' })
export class Order {
  @PrimaryGeneratedColumn({ type: 'int', name: 'orderId' })
  orderId: number;

  /**
   * 绑定 userId
   */
  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @Column({
    type: 'enum',
    enum: EOrderStatus,
    name: 'status',
    comment: '订单的状态 -> 进行中 & 已完成',
    default: EOrderStatus.已下单,
  })
  status: number;

  @Column('text', {
    name: 'orderDetail',
    nullable: true,
    comment: '商品详情JSON',
  })
  orderDetail: string;

  @Column('int', { name: 'number', comment: '订单商品总数量' })
  productCount: number;

  @Column('float', { name: 'price', comment: '订单总金额' })
  price: number;

  @Column('varchar', { name: 'province', length: 45, comment: '省' })
  province: string;

  @Column('varchar', { name: 'city', length: 45, comment: '市' })
  city: string;

  @Column('varchar', { name: 'area', length: 45, comment: '区' })
  area: string;

  @Column('text', { name: 'detail', nullable: true, comment: '详情地址' })
  detail: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
