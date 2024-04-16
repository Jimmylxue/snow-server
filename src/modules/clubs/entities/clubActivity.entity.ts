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
import { Club } from './club.entity';

/**
 * 社团活动
 */
@Entity('clubActivity', { schema: 'snow-server' })
export class ClubActivity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'activityId',
    comment: '社团活动id',
  })
  clubActivityId: number;

  /**
   * 活动创建者 - userId
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: number;

  @Column({ type: 'int', name: 'clubId' })
  clubId: number;

  /**
   * 绑定 社团
   */
  @ManyToOne(() => Club, (club) => club.clubId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clubId' })
  club: any;

  @Column('varchar', { name: 'name', length: 45, comment: '社团活动名称' })
  name: string;

  @Column({ type: 'int', name: 'signStartTime', comment: '签到开始时间' })
  signStartTime: number;

  @Column({ type: 'int', name: 'signEndTime', comment: '签到结束时间' })
  signEndTime: number;

  @Column('text', { name: 'desc', nullable: true, comment: '社团活动描述' })
  desc: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
