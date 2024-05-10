import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 系统记录
 */
@Entity('systemPlatform', { schema: 'snow-server' })
export class Club {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'platformId',
    comment: '平台id',
  })
  platformId: number;

  @Column('varchar', { name: 'name', length: 45, comment: '平台名称' })
  name: string;

  @Column('text', { name: 'desc', nullable: true, comment: '平台描述' })
  desc: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
