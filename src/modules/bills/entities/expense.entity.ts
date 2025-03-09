import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TBExpenseUserType } from './expenseUserType.entity';
import { User } from '@src/modules/admin/system/user/entities/user.entity';

@Entity('tb_expenses', { schema: 'snow-server', comment: '支出明细' })
export class TBExpense {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ManyToOne(() => TBExpenseUserType, (expenseType) => expenseType.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'expense_type_id' })
  type: number;

  @Column('int', { name: 'expense_type_id', comment: '类型id' })
  expenseTypeId: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @Column('text', { name: 'cover', nullable: true, comment: '配图' })
  cover: string;

  @Column('int', { name: 'price', comment: '支付金额' })
  price: number;

  @Column('text', { name: 'description', comment: '备注', nullable: true })
  description: string;

  @Column('timestamp', { name: 'use_time', comment: '支出时间' })
  use_time: Date;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
