import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 社团
 */
@Entity('questionType', { schema: 'snow-server' })
export class QuestionType {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '题目类型id' })
  id: number;

  @Column('varchar', { name: 'name', length: 45, comment: '社团名称' })
  name: string;

  @Column('text', { name: 'desc', nullable: true, comment: '社团描述' })
  desc: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
