import { User } from '@src/modules/admin/system/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EPayStatus {
  未支付 = 1,
  已支付 = 2,
}

/**
 * 维护 手机号 跟 金币的关系
 */
@Entity('phonecoin', { schema: 'snow-server' })
export class PhoneCoin {
  @PrimaryColumn({ type: 'varchar', name: 'phone' })
  phone: string;

  @Column({ type: 'int', name: 'coin' })
  coin: number;

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

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
