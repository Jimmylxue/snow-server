import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('snow_memo_user_language', { schema: 'snow-server' })
export class UserLanguage {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'userId' })
  userId: number;

  @Column('int', { name: 'languageId' })
  languageId: number;
}
