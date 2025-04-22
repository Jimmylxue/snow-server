import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 考研题库类型
 */
@Entity('questionType', { schema: 'snow-server' })
export class QuestionType {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'examTypeId',
    comment: '考试题库类型id',
  })
  id: number;

  @Column('varchar', { name: 'name', length: 45, comment: '考试题库类型' })
  name: string;

  @Column('text', { name: 'desc', nullable: true, comment: '考试题库类型描述' })
  desc: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
