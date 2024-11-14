import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  EPayStatus,
  WithdrawalRecord,
} from '../../entities/withdrawalRecord.entity';
import {
  CarryWithdrawalDto,
  CompleteWithdrawalDto,
  CWithdrawalRecordDto,
  WithdrawalDetailDto,
} from '../../dto/withdrawal.dto';
import { formatFullTime } from '@src/utils';
import { PhoneCoin } from '../../entities/phoneCoin.entity';
import { PhoneCoinListDto } from '../../dto/phoneCoin.dto';

@Injectable()
export class PhoneCoinService {
  constructor(
    @InjectRepository(PhoneCoin)
    private readonly phoneCoinRepository: Repository<PhoneCoin>,
  ) {}

  async getPhoneCoin(phone: string, userId: number) {
    const record = await this.phoneCoinRepository.findOneBy({ phone });
    if (!record?.phone) {
      await this.addPhoneCoinRecord(phone, userId, 0);
      return 0;
    } else {
      return record.coin || 0;
    }
  }

  async updateUserPhoneCoin(phone: string, coin: number) {
    return await this.phoneCoinRepository.update(phone, {
      coin,
    });
  }

  async addPhoneCoinRecord(phone: string, userId: number, coin: number = 0) {
    const record = this.phoneCoinRepository.create();
    record.phone = phone;
    record.coin = coin;
    record.user = userId;
    record.userId = userId;
    await this.phoneCoinRepository.save(record);
  }

  async getPhoneCoinList(body: PhoneCoinListDto) {
    const { page, pageSize, startTime, endTime, ...where } = body;
    const [result, total] = await this.phoneCoinRepository.findAndCount({
      where: {
        ...where,
        createdTime: startTime
          ? Between(
              formatFullTime(Number(startTime)),
              formatFullTime(Number(endTime)),
            )
          : undefined,
      },
      // relations: {
      //   // @ts-ignore
      //   user: relations ? true : false,
      // },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      page: page,
      result,
      total,
    };
  }
}
