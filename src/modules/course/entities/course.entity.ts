import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseType } from './courseType.entity';
import { User } from '@src/modules/admin/system/user/entities/user.entity';

export enum EExamType {
  选择题 = 1,
  判断题,
  填空题,
}

/**
 * 社团
 */
@Entity('course', { schema: 'snow-server' })
export class Course {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '题目id' })
  id: number;

  @Column('varchar', { name: 'name', length: 45, comment: '题目标题' })
  name: string;

  @Column('text', { name: 'desc', nullable: true, comment: '课程描述' })
  desc: string;

  @Column({ type: 'int', name: 'typeId' })
  typeId: number;
  /**
   * 绑定 活动
   */
  @ManyToOne(() => CourseType, (courseType) => courseType.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'typeId' })
  type: any;

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

  @Column('text', { name: 'cover', nullable: true, comment: '封面' })
  cover: string;

  @Column('text', { name: 'source', nullable: true, comment: '题目的选项内容' })
  source: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
