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

/**
 * 考研模块 每个科目的 完成记录
 */
@Entity('questionTypeComplete')
export class QuestionTypeComplete {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '考试题库类型id',
  })
  id: number;

  @JoinColumn({ name: 'questionTypeId' })
  questionType: number;

  @Column('int', { name: 'questionTypeId', comment: '考研项目id' })
  questionTypeId: number;

  @Column('int', { name: 'useTime', comment: '考试用时' })
  useTime: number;

  @Column('int', { name: 'userId', comment: '用户id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
