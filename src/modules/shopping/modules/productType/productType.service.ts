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
    return await this.productTypeRepository.find({
      // select: ['recordId', 'letter', 'status', 'createdTime'],
      // relations: {
      //   letter: true,
      // },
      where: {
        ...body,
        // clubMemberId: userId,
      },
      order: {
        id: 'DESC',
      },
    });
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
