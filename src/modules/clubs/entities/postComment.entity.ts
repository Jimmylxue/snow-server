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
import { ClubPosts } from './posts.entity';

/**
 * 社团帖子的评论
 */
@Entity('clubPostComment', { schema: 'snow-server' })
export class ClubPostComment {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'commentId',
    comment: '社团帖子评论id',
  })
  commentId: number;

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

  @Column({ type: 'int', name: 'clubPostsId' })
  clubPostsId: number;

  /**
   * 绑定社团活动
   */
  @ManyToOne(() => ClubPosts, (ClubPosts) => ClubPosts.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  clubPosts: any;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  /**
   * 评论参与者的 - userId
   */
  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column('text', { name: 'desc', nullable: true, comment: '评论内容' })
  content: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
