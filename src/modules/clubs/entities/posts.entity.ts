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
 * 社团成员之间的帖子
 */
@Entity('clubPosts', { schema: 'snow-server' })
export class ClubPosts {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '社团帖子id',
  })
  id: number;

  @Column({ type: 'int', name: 'clubId' })
  clubId: number;
  /**
   * 绑定社团
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

  // /**
  //  * 点赞的 - userId
  //  */
  // @ManyToOne(() => User)
  // @JoinColumn()

  @Column('text', { name: 'title', nullable: true, comment: '帖子标题' })
  title: string;

  @Column('text', { name: 'content', nullable: true, comment: '帖子内容' })
  content: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
