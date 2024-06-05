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
import { ProductType } from './productType.entity';

export enum EProductStatus {
  有库存 = 1,
  售罄,
}

export enum ESaleStatus {
  上架中 = 1,
  下架中,
}

@Entity('product', { schema: 'snow-server' })
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', name: 'productId' })
  productId: number;

  @Column({ type: 'int', name: 'productTypeId' })
  productTypeId: number;

  /**
   * 绑定社团
   */
  @ManyToOne(() => ProductType, (productType) => productType.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  productType: any;

  /**
   * 绑定 userId
   */
  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @Column('varchar', { name: 'title', length: 45, comment: '商品标题' })
  title: string;

  @Column('varchar', { name: 'subTitle', length: 45, comment: '商品副标题' })
  subTitle: string;

  @Column('text', { name: 'desc', nullable: true, comment: '商品描述' })
  desc: string;

  @Column('text', { name: 'imgSrc', nullable: true, comment: '商品图片' })
  imgSrc: string;

  @Column('text', { name: 'videoSrc', nullable: true, comment: '商品视频' })
  videoSrc: string;

  @Column('float', { name: 'price', comment: '商品金额' })
  price: number;

  @Column({
    type: 'enum',
    enum: EProductStatus,
    name: 'status',
    comment: '商品的销售状态 -> 售卖中 & 售罄',
    default: EProductStatus.有库存,
  })
  status: number;

  @Column({
    type: 'enum',
    enum: ESaleStatus,
    name: 'saleStatus',
    comment: '商品的销售状态 -> 售卖中 & 售罄',
    default: ESaleStatus.上架中,
  })
  saleStatue: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
