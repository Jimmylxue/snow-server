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

/**
 * 社团
 */
@Entity('club', { schema: 'snow-server' })
export class Club {
  @PrimaryGeneratedColumn({ type: 'int', name: 'clubId', comment: '社团id' })
  clubId: number;

  /**
   * 社团创建者的id
   */
  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @Column('varchar', { name: 'name', length: 45, comment: '社团名称' })
  name: string;

  @Column('text', { name: 'desc', nullable: true, comment: '社团描述' })
  desc: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
