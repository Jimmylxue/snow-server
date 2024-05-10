import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('snow_memo_sentence', { schema: 'snow-server' })
export class Sentence {
  @PrimaryGeneratedColumn({ type: 'int', name: 'sentenceId' })
  sentenceId: number;

  @Column('text', { name: 'sentence' })
  sentence: string;

  @Column('text', { name: 'chineseMean' })
  chineseMean: string;

  @Column('int', { name: 'languageId' })
  languageId: number;

  @Column('int', { name: 'userId' })
  userId: number;
}
