import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('userGeoRecord', { schema: 'snow-server' })
export class UserGeoRecord {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: number;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @Column({ type: 'varchar', name: 'latitude', comment: '纬度' })
  latitude: string;

  @Column({ type: 'varchar', name: 'longitude', comment: '经度' })
  longitude: string;

  @Column({ type: 'varchar', name: 'country', comment: '国家' })
  country: string;

  @Column({ type: 'varchar', name: 'province', comment: '省' })
  province: string;

  @Column({ type: 'varchar', name: 'city', comment: '城市' })
  city: string;

  @Column({ type: 'varchar', name: 'district', comment: '地区' })
  district: string;

  @Column({ type: 'varchar', name: 'township', comment: '乡镇' })
  township: string;

  @Column({ type: 'varchar', name: 'formatted_address', comment: '大致位置' })
  formatted_address: string;

  @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
  updateTime: Date;
}
