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
import { CheckInRecord } from './checkInRecord.entity';

export enum EStatus {
  '进行中' = 1,
  '已归档',
}

export enum EFrequency {
  '按天',
  '按周',
}

export enum ETarget {
  永远 = 1,
  '7天' = 2,
  '21天' = 3,
  '300天' = 4,
  '365天' = 5,
}

export enum ENotifyTime {
  '6:00' = 1,
  '7:00',
  '8:00',
  '9:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
}

@Entity('habit', { schema: 'snow-server' })
export class Habit {
  @PrimaryGeneratedColumn({ type: 'int', name: 'habitId' })
  habitId: number;

  // @Column('int', { name: 'userId' })
  // userId: number;

  /**
   * 绑定 userId
   */
  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column('varchar', { name: 'name', length: 45 })
  name: string;

  @Column('text', { name: 'desc', nullable: true, comment: '打卡项目描述' })
  desc: string;

  @Column({
    type: 'enum',
    enum: ETarget,
    name: 'target',
    comment: '目标打卡完成天数',
  })
  target: string;

  @Column({
    type: 'enum',
    enum: EFrequency,
    name: 'frequency',
    comment: '打卡频率要求',
    default: EFrequency.按天,
  })
  frequency: number;

  /**
   * 0,1,2 说明 要求 周日 周一 周二 需要打卡
   */
  @Column('varchar', {
    name: 'frequencyDay',
    comment: '按天打卡的值',
    nullable: true,
  })
  frequencyDay: string;

  /**
   * 3 则表示要求一周打卡三次 不管周几
   */
  @Column('varchar', {
    name: 'frequencyWeek',
    comment: '按天打卡的值',
    nullable: true,
  })
  frequencyWeek: number;

  @Column({
    type: 'boolean',
    name: 'notifyFlag',
    comment: '是否开启提醒',
  })
  notifyFlag: boolean;

  @Column({
    type: 'enum',
    enum: ENotifyTime,
    name: 'notifyTime',
    comment: '提醒时间',
    nullable: true,
  })
  notifyTime: number;

  @Column({
    type: 'enum',
    enum: EStatus,
    name: 'status',
    comment: '打卡任务的状态 -> 进行中 & 已完成',
  })
  status: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;

  @OneToMany(() => CheckInRecord, (checkInRecord) => checkInRecord.habit)
  checkInRecord: CheckInRecord[];
}
