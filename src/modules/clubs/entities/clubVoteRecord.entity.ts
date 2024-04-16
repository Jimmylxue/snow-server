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

enum EChoose {
  同意 = 1,
  反对,
}

/**
 * 社团投票记录
 */
@Entity('clubVoteRecord', { schema: 'snow-server' })
export class clubVoteRecord {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'clubVoteRecordId',
    comment: '社团投票记录id',
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
   * 评论参与者的 - userId
   */
  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column({
    type: 'enum',
    enum: EChoose,
    name: 'choose',
    comment: '投票的选择',
  })
  choose: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
