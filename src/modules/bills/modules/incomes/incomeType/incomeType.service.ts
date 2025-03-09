import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IncomeTypeAddDTO,
  IncomeTypeUpdateDTO,
  IncomeTypeListDTO,
} from '../dto/incomeType.dto';
import { TBIncomeUserType } from '@src/modules/bills/entities/incomeUserType.entity';
import { TBIncomeSystemType } from '@src/modules/bills/entities/incomeSystemType.entity';

@Injectable()
export class IncomeTypeService {
  constructor(
    @InjectRepository(TBIncomeUserType)
    private readonly incomeTypeRepository: Repository<TBIncomeUserType>,
    @InjectRepository(TBIncomeSystemType)
    private readonly incomeSystemTypeRepository: Repository<TBIncomeSystemType>,
  ) {}

  async getList(params: IncomeTypeListDTO, userId: number) {
    return await this.incomeTypeRepository.find({
      where: {
        ...params,
        userId,
      },
    });
  }

  async getDetail(id: number) {
    return await this.incomeTypeRepository.findOneBy({
      id,
    });
  }

  async add(params: IncomeTypeAddDTO, userId: number) {
    const item = await this.incomeTypeRepository.create();
    item.name = params.name;
    item.description = params.description;
    item.cover = params.cover;
    item.userId = userId;
    item.user = userId;
    await this.incomeTypeRepository.save(item);
  }

  async updateType(params: IncomeTypeUpdateDTO) {
    const { id, ...args } = params;
    return await this.incomeTypeRepository.update(
      { id },
      {
        ...args,
      },
    );
  }

  async del(id: number) {
    return await this.incomeTypeRepository.delete({ id });
  }

  /**
   * 添加系统类型到用户类型
   */
  async addSystemTypeToUserType(userId: number) {
    const systemType = await this.incomeSystemTypeRepository.find();
    const userType = await this.incomeTypeRepository.find({
      where: {
        userId,
      },
    });
    for (const type of systemType) {
      const isExist = userType.find((item) => item.name === type.name);
      if (isExist) {
        continue;
      }
      await this.incomeTypeRepository.save({
        name: type.name,
        description: type.description,
        cover: type.cover,
        userId,
      });
    }
  }
}
