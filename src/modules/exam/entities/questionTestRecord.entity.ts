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
import { QuestionType } from './questionType.entity';

/**
 * 考研测试记录
 */
@Entity('questionTestRecord', { schema: 'snow-server' })
export class QuestionTestRecord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '考研记录id' })
  id: number;

  @Column('int', { name: 'userId', comment: '用户id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: number;

  @Column('int', { name: 'questionTypeId', comment: '考试题库类型id' })
  questionTypeId: number;

  @ManyToOne(() => QuestionType, (questionType) => questionType.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionTypeId' })
  questionType: number;

  @Column('int', { name: 'score', comment: '考试得分' })
  score: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
