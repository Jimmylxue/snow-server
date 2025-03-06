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
import { TBIncome } from './income.entity';
import { User } from '@src/modules/admin/system/user/entities/user.entity';

@Entity('tb_income_user_type', { schema: 'snow-server', comment: '收入类型' })
export class TBIncomeUserType {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 200 })
  name: string;

  @Column('text', { name: 'cover', nullable: true, comment: '类型封面' })
  cover: string;

  @Column('text', { name: 'description', nullable: true })
  description: string;

  @OneToMany(() => TBIncome, (income) => income.type)
  incomes: TBIncome[];

  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
