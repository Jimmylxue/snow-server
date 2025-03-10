import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { TBExpense } from '../../../entities/expense.entity';
import {
  ExpenseAddDTO,
  ExpenseListDTO,
  ExpenseUpdateDTO,
} from '../dto/expense.dto';
import { formatFullTime } from '@src/utils';
import { BillsType } from '@src/modules/bills/billsSystem.module';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(TBExpense)
    private readonly expenseRepository: Repository<TBExpense>,
  ) {}

  async getList(params: ExpenseListDTO, userId: number) {
    const { pageSize, page, startTime, endTime, ...where } = params;
    const [result, total] = await this.expenseRepository.findAndCount({
      where: {
        ...where,
        userId,
        use_time: startTime
          ? Between(formatFullTime(startTime), formatFullTime(endTime))
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
        billsType: BillsType.支出,
      })),
      total,
    };
  }

  async getDetail(id: number) {
    return await this.expenseRepository.findOneBy({
      id,
    });
  }

  async add(params: ExpenseAddDTO, userId: number) {
    const item = await this.expenseRepository.create();
    item.description = params.description;
    item.cover = params.cover;
    item.price = params.price;
    item.type = params.typeId;
    item.expenseTypeId = params.typeId;
    item.userId = userId;
    item.user = userId;
    item.use_time = new Date(params.use_time);
    await this.expenseRepository.save(item);
  }

  async update(params: ExpenseUpdateDTO) {
    const { id, ...args } = params;
    return await this.expenseRepository.update(
      { id },
      {
        ...args,
      },
    );
  }

  async del(id: number) {
    return await this.expenseRepository.delete(id);
  }
}
