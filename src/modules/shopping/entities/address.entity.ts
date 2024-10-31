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

export enum EProductTypes {
  充电宝 = 1,
  iphone,
}

export enum EProductLinkTypes {
  临时链接 = 1,
  常规链接,
}

@Entity('address', { schema: 'snow-server' })
export class Address {
  @PrimaryGeneratedColumn({ type: 'int', name: 'addressId' })
  addressId: number;

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

  @Column('varchar', { name: 'shop', length: 45, comment: '超商门市' })
  shop: string;

  @Column('varchar', { name: 'memberCode', length: 45, comment: '邀请码' })
  memberCode: string;

  @Column('varchar', { name: 'sku', length: 300, comment: 'sku属性' })
  sku: string;

  @Column({
    type: 'enum',
    enum: EProductTypes,
    name: 'productType',
    comment: '商品类型',
    default: EProductTypes.充电宝,
  })
  productType: number;

  @Column({
    type: 'enum',
    enum: EProductLinkTypes,
    name: 'productLinkType',
    comment: '商品链接类型',
    default: EProductLinkTypes.常规链接,
  })
  productLinkType: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
