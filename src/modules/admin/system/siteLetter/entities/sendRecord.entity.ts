import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Letter } from './letter.entity';

export enum EStatus {
  未读 = 1,
  已读 = 2,
}

@Entity('sendRecord', { schema: 'snow-server' })
export class SendRecord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'recordId' })
  recordId: number;

  @Column({ type: 'int', name: 'letterId' })
  letterId: number;

  @Column({
    type: 'enum',
    enum: EStatus,
    name: 'status',
    default: EStatus.未读,
  })
  status: number;

  @Column({ type: 'int', name: 'sendUserId' })
  sendUserId: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  recordUser: number;

  // 当letter表的 letterId删除之后 这边会同步一起删除掉
  @ManyToOne(() => Letter, (letter) => letter.sendRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'letterId' })
  letter: Letter;
}
