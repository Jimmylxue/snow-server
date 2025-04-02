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

export enum EExamType {
  选择题 = 1,
  判断题,
  填空题,
}

/**
 * 社团
 */
@Entity('question', { schema: 'snow-server' })
export class Question {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '题目id' })
  id: number;

  @Column('text', { name: 'name', comment: '题目标题' })
  name: string;

  @Column('text', { name: 'desc', nullable: true, comment: '题目意义' })
  desc: string;

  @Column({
    type: 'enum',
    enum: EExamType,
    name: 'examType',
    comment: '题目的考核类型',
    default: EExamType.选择题,
  })
  examType: EExamType;

  @Column({ type: 'int', name: 'typeId' })
  typeId: number;
  /**
   * 绑定 活动
   */
  @ManyToOne(() => QuestionType, (questionType) => questionType.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'typeId' })
  type: any;

  @Column('text', { name: 'option', nullable: true, comment: '题目的选项内容' })
  option: string;

  @Column('varchar', { name: 'answer', length: 45, comment: '题目答案' })
  answer: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
