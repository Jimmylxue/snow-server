import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('managerSetting', { schema: 'snow-server' })
export class ManagerSetting {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'int', name: 'managerId' })
  managerId: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  manager: any;

  @Column({ type: 'int', name: 'disabledStartHour', comment: '禁用开始的小时' })
  disabledStartHour: number;

  @Column({ type: 'int', name: 'disabledEndHour', comment: '禁用结束的小时' })
  disabledEndHour: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
