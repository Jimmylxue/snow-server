import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ELinkStatus {
  未消费 = 1,
  已消费,
}

@Entity('tempLink', { schema: 'snow-server' })
export class TempLink {
  @PrimaryGeneratedColumn({ type: 'int', name: 'linkId' })
  linkId: number;

  @Column('varchar', {
    name: 'province',
    length: 45,
    comment: '临时链接的地址',
  })
  linkCode: string;

  @Column({
    type: 'enum',
    enum: ELinkStatus,
    name: 'linkStatus',
    comment: '商品类型',
    default: ELinkStatus.未消费,
  })
  linkStatus: number;
}
