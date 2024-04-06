import { generateRandomCode } from '@src/utils';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SendRecord } from '../../siteLetter/entities/sendRecord.entity';

enum Role {
  '普通用户',
  '管理员',
}

enum Sex {
  '未知',
  '男',
  '女',
}

@Entity('user', { schema: 'snow-server' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'openid', nullable: true })
  openid: string;

  @Column('varchar', { name: 'username', length: 45 })
  username: string;

  @Column('varchar', {
    name: 'avatar',
    length: 200,
    default:
      'https://image.jimmyxuexue.top/upload/1712285958404vIXPMlNqPXor7394172beb8b1c598b1aafbed556158e.',
  })
  avatar: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.普通用户,
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

  /**
   * 邮箱地址
   */
  @Column('varchar', { name: 'mail', length: 60, nullable: true })
  mail: string;

  @Column('varchar', { name: 'createTime', length: 45 })
  createTime: string;

  @Column('varchar', {
    name: 'password',
    length: 200,
    default: generateRandomCode(),
  })
  password: string;
}
