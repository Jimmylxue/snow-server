import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('web_site', { schema: 'snow-server' })
export class Site {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  web_site_id: number;

  @Column('varchar', { name: 'site_name', length: 45 })
  site_name: string;
}
