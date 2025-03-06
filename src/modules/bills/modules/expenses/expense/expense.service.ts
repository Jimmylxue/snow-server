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
        createdTime: startTime
          ? Between(
              formatFullTime(Number(startTime)),
              formatFullTime(Number(endTime)),
            )
          : undefined,
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
