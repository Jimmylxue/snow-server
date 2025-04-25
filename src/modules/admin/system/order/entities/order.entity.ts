import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('order', { schema: 'snow-server' })
export class Order {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'out_trade_no', comment: '商户订单号' })
  outTradeNo: string;

  @Column({ type: 'float', name: 'total_fee', comment: '支付金额(分)' })
  totalFee: number;

  @Column({
    type: 'varchar',
    name: 'transaction_id',
    comment: '微信支付订单号',
  })
  transactionId: string;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user.id)
  user: number;

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date;
}
