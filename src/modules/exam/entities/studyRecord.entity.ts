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
import { StudyRoom } from './studyRoom.entity';

/**
 * 学习室 - 学习记录
 */
@Entity('studyRecord', { schema: 'snow-server' })
export class StudyRoomRecord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '学习室id' })
  id: number;

  @Column('int', { name: 'userId', comment: '用户id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: number;

  /**
   * 学习开始时间
   */
  @Column('timestamp', { name: 'studyTime', comment: '学习时间' })
  studyTime: number;

  /**
   * 学习结束时间
   */
  @Column('timestamp', {
    name: 'endTime',
    nullable: true,
    comment: '学习结束时间',
  })
  endTime: number;

  @Column('int', { name: 'studyRoomId', comment: '学习室id' })
  studyRoomId: number;

  @ManyToOne(() => StudyRoom, (studyRoom) => studyRoom.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studyRoomId' })
  studyRoom: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
