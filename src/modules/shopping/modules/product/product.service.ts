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
    return await this.productRepository.find({
      // select: ['recordId', 'letter', 'status', 'createdTime'],
      // relations: {
      //   letter: true,
      // },
      where: {
        ...body,
        // clubMemberId: userId,
      },
      order: {
        productId: 'DESC',
      },
    });
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
