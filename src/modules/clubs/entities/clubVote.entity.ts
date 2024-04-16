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
import { Club } from './club.entity';

/**
 * 社团投票
 */
@Entity('clubVote', { schema: 'snow-server' })
export class ClubVote {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '社团投票项id',
  })
  id: number;

  @Column({ type: 'int', name: 'clubId' })
  clubId: number;

  /**
   * 绑定 社团
   */
  @ManyToOne(() => Club, (club) => club.clubId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  club: any;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  /**
   * 帖子作者的 - userId
   */
  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column('varchar', { name: 'name', length: 45, comment: '投票的标题' })
  name: string;

  @Column('text', { name: 'desc', nullable: true, comment: '投票大致的描述' })
  desc: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
