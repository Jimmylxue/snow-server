import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ExpenseTypeAddDTO,
  ExpenseTypeUpdateDTO,
  ExpenseTypeListDTO,
} from '../dto/expenseType.dto';
import { TBExpenseUserType } from '../../../entities/expenseUserType.entity';
import { TBExpenseSystemType } from '@src/modules/bills/entities/expenseSystemType.entity';

@Injectable()
export class ExpensesTypeService {
  constructor(
    @InjectRepository(TBExpenseUserType)
    private readonly expenseUserTypeRepository: Repository<TBExpenseUserType>,
    @InjectRepository(TBExpenseSystemType)
    private readonly expenseSystemTypeRepository: Repository<TBExpenseSystemType>,
  ) {}

  async getList(params: ExpenseTypeListDTO, userId: number) {
    return await this.expenseUserTypeRepository.find({
      where: {
        ...params,
        userId,
      },
    });
  }

  async getDetail(id: number) {
    return await this.expenseUserTypeRepository.findOneBy({
      id,
    });
  }

  async add(params: ExpenseTypeAddDTO, userId: number) {
    const item = await this.expenseUserTypeRepository.create();
    item.name = params.name;
    item.description = params.description;
    item.cover = params.cover;
    item.userId = userId;
    item.user = userId;
    await this.expenseUserTypeRepository.save(item);
  }

  async updateType(params: ExpenseTypeUpdateDTO) {
    const { id, ...args } = params;
    return await this.expenseUserTypeRepository.update(
      { id },
      {
        ...args,
      },
    );
  }

  async del(id: number) {
    return await this.expenseUserTypeRepository.delete({ id });
  }

  /**
   * 添加系统类型到用户类型
   */
  async addSystemTypeToUserType(userId: number) {
    const systemType = await this.expenseSystemTypeRepository.find();
    for (const type of systemType) {
      await this.expenseUserTypeRepository.save({
        name: type.name,
        description: type.description,
        cover: type.cover,
        userId,
      });
    }
  }
}
