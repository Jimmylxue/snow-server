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
import { Course } from './course.entity';

/**
 * 课程订单
 */
@Entity('courseOrder', { schema: 'snow-server' })
export class CourseOrder {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '题目id' })
  id: number;

  @Column({ type: 'int', name: 'courseId' })
  courseId: number;
  /**
   * 绑定 活动
   */
  @ManyToOne(() => Course, (course) => course.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courseId' })
  course: any;

  @Column({ type: 'int', name: 'userId' })
  userId: number;
  /**
   * 绑定 活动
   */
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: any;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
