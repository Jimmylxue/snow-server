import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddOrderDto, DelOrderDto, OrderListDto } from '../../dto/order.dto';
import { Order } from '../../entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getAllList(body: OrderListDto) {
    const list = await this.orderRepository.find({
      // select: ['recordId', 'letter', 'status', 'createdTime'],
      // relations: {
      //   letter: true,
      // },
      where: {
        ...body,
        // clubMemberId: userId,
      },
      order: {
        orderId: 'DESC',
      },
    });

    return list.map((item) => ({
      ...item,
      orderDetail: JSON.parse(item.orderDetail),
    }));
  }

  async addOrder(params: AddOrderDto, userId: number) {
    const type = this.orderRepository.create();
    type.price = params.price;
    type.detail = params.detail;
    type.productCount = params.productCount;
    type.province = params.province;
    type.city = params.city;
    type.area = params.area;
    type.detail = params.detail;
    type.orderDetail = JSON.stringify(params.orderDetail);
    type.user = userId;
    type.userId = userId;
    return await this.orderRepository.save(type);
  }

  async delProduct(params: DelOrderDto) {
    return await this.orderRepository.delete({ orderId: params.orderId });
  }

  // async editProduct(updateParams: EditProductDto) {
  //   const { productId, ...params } = updateParams;
  //   const qb = this.orderRepository.createQueryBuilder('product');
  //   qb.update(Product)
  //     .set(params)
  //     .where('product.productId = :productId', { productId })
  //     .execute();
  //   return { status: 1, message: '更新成功' };
  // }
}
