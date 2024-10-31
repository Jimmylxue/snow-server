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

export enum EOrderStatus {
  已下单 = 1,
  已发货,
  已完成,
  已退款,
}

@Entity('systemConfig', { schema: 'snow-server' })
export class SystemConfig {
  @PrimaryGeneratedColumn({ type: 'int', name: 'configId' })
  configId: number;

  @Column('varchar', { name: 'province', length: 45, comment: 'Line的号码' })
  lineCode: string;

  @Column('varchar', { name: 'city', length: 400, comment: '邀请的code' })
  inviteCode: string;
}
