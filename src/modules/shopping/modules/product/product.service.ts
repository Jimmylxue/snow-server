import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import {
  AddProductDto,
  DelProductDto,
  EditProductDto,
  ProductListDto,
} from '../../dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAllList(body: ProductListDto) {
    const { page, pageSize, ...where } = body;
    const whereConditions = {};
    for (const key in where) {
      if (where[key] !== '') {
        whereConditions[key] = where[key];
      }
    }
    const [result, total] = await this.productRepository.findAndCount({
      where: {
        ...whereConditions,
      },
      order: {
        productId: 'DESC',
      },
      relations: {
        productType: true,
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

  async addProduct(params: AddProductDto, userId: number) {
    const type = this.productRepository.create();
    type.title = params.title;
    type.subTitle = params.subTitle;
    type.desc = params.desc;
    type.imgSrc = params.imgSrc;
    type.videoSrc = params.videoSrc;
    type.price = params.price;
    type.user = userId;
    type.userId = userId;
    type.productType = params.productTypeId;
    type.productTypeId = params.productTypeId;
    type.saleStatue = params.saleStatue;
    type.status = params.status;
    return await this.productRepository.save(type);
  }

  async delProduct(params: DelProductDto) {
    return await this.productRepository.delete({ productId: params.productId });
  }

  async editProduct(updateParams: EditProductDto) {
    const { productId, ...params } = updateParams;
    const qb = this.productRepository.createQueryBuilder('product');
    qb.update(Product)
      .set(params)
      .where('product.productId = :productId', { productId })
      .execute();
    return { status: 1, message: '更新成功' };
  }
}
