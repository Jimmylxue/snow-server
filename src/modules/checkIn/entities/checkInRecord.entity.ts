import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Habit } from './habit.entity';
import { User } from '@src/modules/admin/system/user/entities/user.entity';

@Entity('checkInRecord', { schema: 'snow-server' })
export class CheckInRecord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'checkInId' })
  checkInId: number;

  /**
   * 绑定 habitId
   */
  @ManyToOne(() => Habit, (habit) => habit.checkInRecord, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  habit: any;

  /**
   * 存储打卡的日期 如： 2024-02-09 存储这种时间信息
   */
  @Column('varchar', { name: 'signDate', length: 45 })
  signDate: string;

  /**
   * 存储打卡的年 如： 2024 存储这种时间信息
   */
  @Column('varchar', { name: 'signYear', length: 45 })
  signYear: string;

  /**
   * 存储打卡的月 如： 02 存储这种时间信息
   */
  @Column('varchar', { name: 'signMonth', length: 45 })
  signMonth: string;

  /**
   * 存储打卡的日 如： 09 存储这种时间信息
   */
  @Column('varchar', { name: 'signDay', length: 45 })
  signDay: string;

  /**
   * 绑定 userId
   */
  @ManyToOne(() => User)
  @JoinColumn()
  user: any;

  @CreateDateColumn({ comment: '打卡创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
