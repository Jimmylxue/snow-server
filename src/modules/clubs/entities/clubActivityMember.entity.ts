import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@src/modules/admin/system/user/entities/user.entity';
import { ClubActivity } from './clubActivity.entity';

@Entity('clubActivityMember', { schema: 'snow-server' })
export class ClubActivityMember {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  // @Column({ type: 'int', name: 'clubId' })
  // clubId: number;
  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: any;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;

  @Column({ type: 'int', name: 'clubActivityId' })
  clubActivityId: number;

  // 当letter表的 letterId删除之后 这边会同步一起删除掉
  @ManyToOne(() => ClubActivity, (clubActivityId) => clubActivityId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clubActivityId' })
  clubActivity: number;
}
