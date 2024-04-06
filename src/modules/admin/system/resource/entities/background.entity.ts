import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('background', { schema: 'snow-server' })
export class Background {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'date', length: 45 })
  date: string;

  @Column('text', { name: 'imgSrc' })
  imgSrc: string;
}
