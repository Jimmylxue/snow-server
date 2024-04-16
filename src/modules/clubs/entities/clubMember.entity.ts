import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Club } from './club.entity';
import { User } from '@src/modules/admin/system/user/entities/user.entity';

export enum EStatus {
  未读 = 1,
  已读 = 2,
}

@Entity('clubMember', { schema: 'snow-server' })
export class ClubMember {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'int', name: 'clubMemberId' })
  clubMemberId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'clubMemberId' })
  clubMember: number;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;

  @Column({ type: 'int', name: 'clubId' })
  clubId: number;

  // 当letter表的 letterId删除之后 这边会同步一起删除掉
  @ManyToOne(() => Club, (club) => club, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clubId' })
  club: number;
}
