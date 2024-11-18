import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { formatFullTime } from '@src/utils';
import { CGainCoinRecordDto } from '../../dto/gainCoin.dto';
import { GainCoinRecord } from '../../entities/gainCoinRecord.entity';

@Injectable()
export class GainCoinService {
  constructor(
    @InjectRepository(GainCoinRecord)
    private readonly gainCoinRepository: Repository<GainCoinRecord>,
  ) {}

  /**
   * 手机号账户下的 金币增加记录
   */
  async getUserPhoneGainCoinRecord(
    body: CGainCoinRecordDto,
    relations?: boolean,
  ) {
    const { page, pageSize, startTime, endTime, ...where } = body;
    const [result, total] = await this.gainCoinRepository.findAndCount({
      where: {
        ...where,
        createdTime: startTime
          ? Between(
              formatFullTime(Number(startTime)),
              formatFullTime(Number(endTime)),
            )
          : undefined,
      },
      order: {
        recordId: 'DESC',
      },
      relations: {
        // @ts-ignore
        user: relations ? true : false,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      page: page,
      result,
      total,
    };
  }

  async carryCoinToPhone(
    linkCoin: number,
    userId: number,
    originCoin: number,
    phone: string,
  ) {
    const gainCoinRecord = this.gainCoinRepository.create();
    gainCoinRecord.user = userId;
    gainCoinRecord.userId = userId;
    gainCoinRecord.originCoin = originCoin;
    gainCoinRecord.gainCoin = linkCoin;
    gainCoinRecord.surplusCoin = originCoin + linkCoin;
    gainCoinRecord.phone = phone;
    return await this.gainCoinRepository.save(gainCoinRecord);
  }
}
