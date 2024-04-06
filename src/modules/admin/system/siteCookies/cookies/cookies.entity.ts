import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('site_cookie', { schema: 'snow-server' })
export class Cookies {
  @PrimaryGeneratedColumn({ type: 'int', name: 'site_cookie_id' })
  site_cookie_id: number;

  @Column({ type: 'int', name: 'userId' })
  userId: number;

  @Column({ type: 'int', name: 'website_id' })
  website_id: number;

  @Column('text', { name: 'cookies' })
  cookies: string;

  @Column('varchar', { name: 'createTime', length: 45, nullable: true })
  createTime: string;

  @Column('varchar', { name: 'updateTime', length: 45 })
  updateTime: string;
}
