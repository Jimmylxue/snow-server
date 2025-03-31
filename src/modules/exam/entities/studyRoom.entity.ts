import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EStudyRoomType {
  自由自习模式 = 1,
  统一自习模式,
}

/**
 * 学习室
 */
@Entity('studyRoom', { schema: 'snow-server' })
export class StudyRoom {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '学习室id' })
  id: number;

  @Column({
    type: 'enum',
    enum: EStudyRoomType,
    name: 'studyRoomType',
    comment: '学习室类型',
    default: EStudyRoomType.自由自习模式,
  })
  studyRoomType: EStudyRoomType;

  /**
   * 学习室最大人数
   */
  @Column('int', { name: 'max', comment: '学习室最大人数' })
  max: number;

  /**
   * 学习室开放时间
   */
  @Column('int', { name: 'openTime', comment: '学习室开放时间' })
  openTime: number;

  /**
   * 学习室关闭时间
   */
  @Column('int', { name: 'closeTime', comment: '学习室关闭时间' })
  closeTime: number;

  /**
   * 学习室描述
   */
  @Column('text', { name: 'desc', comment: '学习室描述' })
  desc: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
