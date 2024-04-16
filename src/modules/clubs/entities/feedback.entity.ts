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
import { ClubActivity } from './clubActivity.entity';

/**
 * 社团活动反馈
 */
@Entity('clubFeedback', { schema: 'snow-server' })
export class ClubFeedBack {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '社团反馈id',
  })
  id: number;

  @Column({ type: 'int', name: 'clubId' })
  clubId: number;
  /**
   * 绑定社团
   */
  @ManyToOne(() => Club, (club) => club.clubId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  club: any;

  @Column({ type: 'int', name: 'clubActivityId' })
  clubActivityId: number;

  /**
   * 绑定社团活动
   */
  @ManyToOne(
    () => ClubActivity,
    (ClubActivity) => ClubActivity.clubActivityId,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  clubActivity: any;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  /**
   * 活动参与者的 - userId
   */
  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column('text', { name: 'desc', nullable: true, comment: '反馈内容' })
  content: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
