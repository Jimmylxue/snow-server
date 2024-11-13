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

@Injectable()
export class WithdrawalService {
  constructor(
    @InjectRepository(WithdrawalRecord)
    private readonly withdrawalRepository: Repository<WithdrawalRecord>,
  ) {}

  async getUserWithdrawalRecord(
    body: CWithdrawalRecordDto,
    userId?: number,
    relations?: boolean,
  ) {
    const { page, pageSize, startTime, endTime, ...where } = body;
    const [result, total] = await this.withdrawalRepository.findAndCount({
      where: {
        ...where,
        userId,
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

  async carryWithdrawal(
    params: CarryWithdrawalDto,
    userId: number,
    originCoin: number,
  ) {
    const withdrawalRecord = this.withdrawalRepository.create();
    withdrawalRecord.user = userId;
    withdrawalRecord.userId = userId;
    withdrawalRecord.originCoin = originCoin;
    withdrawalRecord.withdrawalCoin = params.withdrawalCoin;
    withdrawalRecord.surplusCoin = originCoin - params.withdrawalCoin;
    withdrawalRecord.payStatus = EPayStatus.未支付;
    return await this.withdrawalRepository.save(withdrawalRecord);
  }

  async completeWithdrawal(params: CompleteWithdrawalDto) {
    return await this.withdrawalRepository.update(params.recordId, {
      payStatus: EPayStatus.已支付,
    });
  }

  async recordDetail(params: WithdrawalDetailDto) {
    return await this.withdrawalRepository.findOneBy({
      recordId: params.recordId,
    });
  }

  async cancelWithdrawal(params: CompleteWithdrawalDto) {
    return this.withdrawalRepository.delete({ recordId: params.recordId });
  }
}
