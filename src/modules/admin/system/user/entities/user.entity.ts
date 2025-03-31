import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  '学生',
  '管理员',
}

export enum Sex {
  '未知',
  '男',
  '女',
}

@Entity('user', { schema: 'snow-server', comment: '用户表' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: '用户id' })
  id: number;

  @Column('varchar', {
    name: 'username',
    length: 45,
    nullable: true,
    comment: '用户名',
  })
  username: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.学生,
    name: 'role',
  })
  role: number;

  @Column({
    type: 'enum',
    enum: Sex,
    default: Sex.未知,
    name: 'sex',
  })
  sex: number;

  @Column('varchar', {
    name: 'phone',
    length: 45,
    nullable: true,
  })
  phone: string;

  @Column('varchar', { name: 'createTime', length: 45 })
  createTime: string;

  @Column('varchar', {
    name: 'password',
    length: 200,
    nullable: false,
    comment: '密码',
  })
  password: string;

  @Column('varchar', {
    name: 'exam_year',
    length: 45,
    nullable: true,
    comment: '考研年份',
  })
  exam_year: string;

  @Column('int', { name: 'exam_count', comment: '考试次数', nullable: true })
  exam_count: number;
}
