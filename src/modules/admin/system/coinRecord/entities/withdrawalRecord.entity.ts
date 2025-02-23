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

export enum EPayStatus {
  未支付 = 1,
  已支付 = 2,
}

@Entity('withdrawalrecord', { schema: 'snow-server' })
export class WithdrawalRecord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'recordId' })
  recordId: number;

  /**
   * 绑定 userId
   */
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: number;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @Column({ type: 'varchar', name: 'phone' })
  phone: string;

  @Column({ type: 'int', name: 'originCoin', comment: '初始金币' })
  originCoin: number;

  @Column({ type: 'int', name: 'withdrawalCoin', comment: '提现金币' })
  withdrawalCoin: number;

  @Column({ type: 'int', name: 'surplusCoin', comment: '剩余金币' })
  surplusCoin: number;

  @Column({
    type: 'enum',
    enum: EPayStatus,
    name: 'payStatus',
    default: EPayStatus.未支付,
  })
  payStatus: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
