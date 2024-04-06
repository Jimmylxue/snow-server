import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('snow_memo_language_type', { schema: 'snow-server' })
export class Task {
  @PrimaryGeneratedColumn({ type: 'int', name: 'languageId' })
  languageId: number;

  @Column('varchar', { name: 'chineseMean', length: 45 })
  chineseMean: string;
}
