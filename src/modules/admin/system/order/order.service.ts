import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

type TOrder = {
  outTradeNo: string;
  transactionId: string;
  totalFee: number;
};

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder(
    userId: number,
    { outTradeNo, transactionId, totalFee }: TOrder,
  ) {
    const order = await this.orderRepository.create();
    order.userId = userId;
    order.user = userId;
    order.outTradeNo = outTradeNo;
    order.transactionId = transactionId;
    order.totalFee = totalFee;
    return await this.orderRepository.save(order);
  }

  async getGroupStatus(userId: number) {
    const order = await this.orderRepository.findOne({
      where: { userId },
    });
    return order?.id ? true : false;
  }
}
