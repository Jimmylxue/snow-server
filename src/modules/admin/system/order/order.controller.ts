import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/add_group_order')
  async addGroupOrder(@Req() req) {
    const { user } = req;
    const userId = user.id;
    await this.orderService.createOrder(userId, {
      outTradeNo: '1234567890',
      transactionId: '1234567890',
      totalFee: 100,
    });
    return {
      code: 200,
      result: '入群下单成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/group_status')
  async getGroupStatus(@Req() req) {
    const { user } = req;
    const userId = user.id;
    const order = await this.orderService.getGroupStatus(userId);
    return {
      code: 200,
      result: order,
    };
  }
}
