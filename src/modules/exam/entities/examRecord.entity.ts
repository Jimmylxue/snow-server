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

export enum EExamProjectType {
  数学 = 1,
  英语,
  政治,
}

/**
 * 考试记录
 */
@Entity('examRecord', { schema: 'snow-server' })
export class ExamRecord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '考试记录id' })
  id: number;

  @Column('int', { name: 'userId', comment: '用户id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: number;

  @Column({
    type: 'int',
    name: 'examType',
    default: EExamProjectType.数学,
    comment: '考试科目类型',
  })
  examType: number;

  @Column('text', { name: 'desc', comment: '考试心得' })
  desc: string;

  @Column('int', { name: 'useTime', comment: '考试用时' })
  useTime: number;

  @Column('int', { name: 'remainTime', comment: '剩余时间' })
  remainTime: number;

  @Column('int', { name: 'overTime', comment: '超时时间' })
  overTime: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
