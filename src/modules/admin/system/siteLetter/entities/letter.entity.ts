import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SendRecord } from './sendRecord.entity';

export enum EPlatform {
  系统消息 = 1,
  公告栏,
  客服消息,
}

@Entity('letter', { schema: 'snow-server' })
export class Letter {
  @PrimaryGeneratedColumn({ type: 'int', name: 'letterId' })
  letterId: number;

  @Column({
    type: 'enum',
    enum: EPlatform,
    name: 'platform',
    nullable: true,
  })
  platform: number;

  @Column('varchar', { name: 'title', length: 768 })
  title: string;

  @Column('text', { name: 'content' })
  content: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;

  @OneToMany(() => SendRecord, (sendRecord) => sendRecord.letter)
  sendRecords: SendRecord[];
}
