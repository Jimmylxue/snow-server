import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TBIncomeUserType } from './incomeUserType.entity';
import { User } from '@src/modules/admin/system/user/entities/user.entity';

@Entity('tb_incomes', { schema: 'snow-server', comment: '收入明细' })
export class TBIncome {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ManyToOne(() => TBIncomeUserType, (incomeType) => incomeType.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'income_type_id' })
  type: number;

  @Column('int', { name: 'income_type_id', comment: '类型id' })
  incomeTypeId: number;

  @Column('text', { name: 'cover', nullable: true, comment: '配图' })
  cover: string;

  @Column('int', { name: 'price', comment: '支付金额' })
  price: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @Column('text', { name: 'description', comment: '备注', nullable: true })
  description: string;

  @Column('timestamp', { name: 'use_time', comment: '收入时间' })
  use_time: Date;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
