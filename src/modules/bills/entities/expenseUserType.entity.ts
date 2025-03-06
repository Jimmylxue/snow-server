import { User } from '@src/modules/admin/system/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TBExpense } from './expense.entity';

@Entity('tb_expense_user_type', {
  schema: 'snow-server',
  comment: '用户自定义支出类型',
})
export class TBExpenseUserType {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 200 })
  name: string;

  @Column('text', { name: 'cover', nullable: true, comment: '类型封面' })
  cover: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @Column('text', { name: 'description', nullable: true })
  description: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;

  @OneToMany(() => TBExpense, (expense) => expense.type)
  expenses: TBExpense[];
}
