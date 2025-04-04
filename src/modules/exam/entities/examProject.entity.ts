import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 考试记录
 */
@Entity('examProject', { schema: 'snow-server' })
export class ExamProject {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '考试记录id' })
  id: number;

  @Column('text', { name: 'projectName', comment: '科目名称' })
  projectName: string;

  @Column('text', { name: 'paperDesc', comment: '试卷名称' })
  paperText: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
