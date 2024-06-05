import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductType } from '../../entities/productType.entity';
import {
  AddProductTypeDto,
  DelProductTypeDto,
  EditProductTypeDto,
  ProductTypeListDto,
} from '../../dto/productType.dto';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,
  ) {}

  async getAllList(body: ProductTypeListDto) {
    const { page, pageSize, ...where } = body;
    const whereConditions = {};
    for (const key in where) {
      if (where[key] !== '') {
        whereConditions[key] = where[key];
      }
    }
    const [result, total] = await this.productTypeRepository.findAndCount({
      where: {
        ...whereConditions,
      },
      order: {
        id: 'DESC',
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

  async add(params: AddProductTypeDto, userId: number) {
    const type = this.productTypeRepository.create();
    type.title = params.title;
    type.subTitle = params.subTitle;
    type.desc = params.desc;
    type.imgSrc = params.imgSrc;
    type.user = userId;
    type.userId = userId;
    return await this.productTypeRepository.save(type);
  }

  async del(params: DelProductTypeDto) {
    return await this.productTypeRepository.delete({
      id: params.id,
    });
  }

  async edit(updateParams: EditProductTypeDto) {
    const { id, ...params } = updateParams;
    console.log('params', params);
    const qb = this.productTypeRepository.createQueryBuilder('productType');
    qb.update(ProductType)
      .set(params)
      .where('productType.id = :id', { id })
      .execute();
    return { status: 1, message: '更新成功' };
  }
}
