import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum EStatus {
  未完成,
  完成,
}

@Entity('task', { schema: 'snow-server' })
export class Task {
  @PrimaryGeneratedColumn({ type: 'int', name: 'taskId' })
  taskId: number;

  @Column('int', { name: 'typeId' })
  typeId: number;

  @Column('int', { name: 'userId' })
  userId: number;

  @Column({
    type: 'enum',
    enum: EStatus,
    name: 'status',
    default: EStatus.未完成,
  })
  status: number;

  @Column('varchar', { name: 'taskName', length: 768 })
  taskName: string;

  @Column('text', { name: 'taskContent' })
  taskContent: string;

  @Column('varchar', { name: 'createTime', length: 45, nullable: true })
  createTime: string;

  @Column('varchar', { name: 'completeTime', length: 45, nullable: true })
  completeTime: string;

  @Column('varchar', { name: 'updateTime', length: 45, nullable: true })
  updateTime: string;

  // 期待任务完成的时间
  @Column('varchar', { name: 'expectTime', length: 45, nullable: true })
  expectTime: string;
}
