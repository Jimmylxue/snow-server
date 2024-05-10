import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bingBgStore', { schema: 'snow-server' })
export class BingBgStore {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'startdate', length: 45 })
  startdate: string;

  @Column('text', { name: 'url' })
  url: string;

  @Column('text', { name: 'urlbase' })
  urlbase: string;

  @Column('text', { name: 'copyright' })
  copyright: string;

  @Column('varchar', { name: 'title', length: 200 })
  title: string;
}
