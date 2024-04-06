import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum EIsMemory {
  '未记牢',
  '已记牢',
}

@Entity('snow_memo_words', { schema: 'snow-server' })
export class Word {
  @PrimaryGeneratedColumn({ type: 'int', name: 'wordId' })
  wordId: number;

  @Column('varchar', { name: 'word', length: 45 })
  word: string;

  @Column('varchar', { name: 'chineseMean', length: 45 })
  chineseMean: string;

  @Column({
    type: 'enum',
    enum: EIsMemory,
    name: 'isMemory',
    default: EIsMemory.未记牢,
  })
  isMemory: number;

  /**
   * 记错次数
   */
  @Column('int', { name: 'notMemoryWrongCount', default: 0 })
  notMemoryWrongCount: number;

  /**
   * 记对次数
   */
  @Column('int', { name: 'hasMemoryWrongCount', default: 0 })
  hasMemoryWrongCount: number;

  @Column('int', { name: 'languageId' })
  languageId: number;

  @Column('int', { name: 'userId' })
  userId: number;
}
