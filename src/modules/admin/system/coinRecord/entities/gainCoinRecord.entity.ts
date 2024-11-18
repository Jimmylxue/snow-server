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

@Entity('GainCoinRecord', { schema: 'snow-server' })
export class GainCoinRecord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'recordId' })
  recordId: number;
  /**
   * 绑定 userId
   */
  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @Column({ type: 'varchar', name: 'phone' })
  phone: string;

  @Column({ type: 'int', name: 'originCoin', comment: '初始金币' })
  originCoin: number;

  @Column({ type: 'int', name: 'gainCoin', comment: '新增金币' })
  gainCoin: number;

  @Column({ type: 'int', name: 'surplusCoin', comment: '剩余金币' })
  surplusCoin: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
