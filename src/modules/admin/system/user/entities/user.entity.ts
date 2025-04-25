import { generateRandomCode } from '@src/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  '未定义',
  '普通用户',
  '管理员',
  '超级管理员',
}

export enum Sex {
  '未知',
  '男',
  '女',
}

export enum Level {
  新人 = 1,
  专职,
}

export enum LoginStatus {
  下线 = 1,
  在线,
}

@Entity('user', { schema: 'snow-server' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'openid' })
  openid: string;

  @Column('varchar', { name: 'username', length: 45, nullable: true })
  username: string;

  @Column('varchar', {
    name: 'wxName',
    length: 45,
    nullable: true,
    comment: '微信号',
  })
  wxName: string;

  @Column('varchar', {
    name: 'nickname',
    length: 45,
    default: `游客${Math.floor(Date.now() / 1000)}`,
  })
  nickname: string;

  @Column('varchar', {
    name: 'avatar',
    length: 200,
    nullable: true,
  })
  avatar: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.未定义,
    name: 'role',
  })
  role: number;

  @Column({
    type: 'enum',
    enum: Level,
    default: Level.新人,
    name: 'level',
  })
  level: number;

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

  /**
   * 邮箱地址
   */
  @Column('varchar', { name: 'mail', length: 60, nullable: true })
  mail: string;

  @Column('int', { name: 'coin', default: 0 })
  coin: number;

  @Column('varchar', {
    name: 'password',
    length: 200,
    default: generateRandomCode(),
  })
  password: string;

  @Column('int', { name: 'inviter', nullable: true, comment: '邀请注册人' })
  inviter: number;

  @Column({
    type: 'enum',
    enum: LoginStatus,
    default: LoginStatus.下线,
    name: 'loginStatus',
  })
  loginStatus: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastActive: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date;
}
