import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@src/modules/admin/system/user/entities/user.entity';
import { ClubActivity } from './clubActivity.entity';
import { Club } from './club.entity';

@Entity('clubActivitySignIn', { schema: 'snow-server' })
export class ClubSignInRecord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '签到Id' })
  id: number;

  @Column({ type: 'int', name: 'activityId' })
  /**
   * 绑定 活动id
   */
  activityId: number;

  @ManyToOne(
    () => ClubActivity,
    (clubActivity) => clubActivity.clubActivityId,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  activity: any;

  @Column({ type: 'int', name: 'clubId' })
  clubId: number;
  /**
   * 绑定社团id
   */
  @ManyToOne(() => Club, (club) => club.clubId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  club: any;

  @Column({ type: 'int', name: 'userId' })
  userId: number;
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
