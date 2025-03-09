import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  IncomeAddDTO,
  IncomeListDTO,
  IncomeUpdateDTO,
} from '../dto/income.dto';
import { formatFullTime } from '@src/utils';
import { TBIncome } from '@src/modules/bills/entities/income.entity';
import { BillsType } from '@src/modules/bills/billsSystem.module';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(TBIncome)
    private readonly incomeRepository: Repository<TBIncome>,
  ) {}

  async getList(params: IncomeListDTO) {
    const { pageSize, page, startTime, endTime, ...where } = params;
    const [result, total] = await this.incomeRepository.findAndCount({
      where: {
        ...where,
        use_time: startTime
          ? Between(
              formatFullTime(Number(startTime)),
              formatFullTime(Number(endTime)),
            )
          : undefined,
      },
      relations: ['type'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      page: page,
      result: result.map((item) => ({
        ...item,
        billsType: BillsType.收入,
      })),
      total,
    };
  }

  async getDetail(id: number) {
    return await this.incomeRepository.findOneBy({
      id,
    });
  }

  async add(params: IncomeAddDTO, userId: number) {
    const item = await this.incomeRepository.create();
    item.description = params.description;
    item.cover = params.cover;
    item.price = params.price;
    item.type = params.typeId;
    item.incomeTypeId = params.typeId;
    item.userId = userId;
    item.user = userId;
    item.use_time = new Date(params.use_time);
    console.log(item);
    await this.incomeRepository.save(item);
  }

  async update(params: IncomeUpdateDTO) {
    const { id, ...args } = params;
    return await this.incomeRepository.update(
      { id },
      {
        ...args,
      },
    );
  }

  async del(id: number) {
    return await this.incomeRepository.delete(id);
  }
}
