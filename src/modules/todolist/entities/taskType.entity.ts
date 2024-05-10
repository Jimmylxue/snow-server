import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('taskType', { schema: 'snow-server' })
export class TaskType {
  @PrimaryGeneratedColumn({ type: 'int', name: 'typeId' })
  typeId: number;

  @Column('int', { name: 'userId' })
  userId: number;

  @Column('varchar', { name: 'typeName', length: 45 })
  typeName: string;

  @Column('text', { name: 'desc', nullable: true })
  desc: string;

  @Column('varchar', { name: 'createTime', length: 45 })
  createTime: string;

  @Column('varchar', { name: 'updateTime', length: 45, nullable: true })
  updateTime: string;

  @Column('varchar', { name: 'themeColor', length: 45, nullable: true })
  themeColor: string;

  @Column('varchar', { name: 'icon', length: 45, nullable: true })
  icon: string;
}
