import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';
import { AddOrderDto, DelOrderDto, OrderListDto } from '../../dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 添加订单
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async signIn(@Body() body: AddOrderDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const records = await this.orderService.addOrder(body, userId);
    return {
      code: 200,
      result: records,
    };
  }

  /**
   * 查看订单列表
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getSignList(@Body() body: OrderListDto, @Req() auth) {
    const list = await this.orderService.getAllList(body);
    if (list) {
      return {
        code: 200,
        result: list,
      };
    }
  }

  // /**
  //  * 编辑订单
  //  */
  // @UseGuards(AuthGuard('jwt'))
  // @Post('/edit')
  // async editProduct(@Body() body: EditProductDto) {
  //   const letter = await this.orderService.editProduct(body);
  //   if (letter) {
  //     return {
  //       code: 200,
  //       result: '操作成功',
  //     };
  //   }
  // }

  /**
   * 删除订单
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delProduct(@Body() body: DelOrderDto) {
    const res = await this.orderService.delProduct(body);
    if (res.affected === 0) {
      return {
        code: 500,
        result: '检查删除内容是否存在',
      };
    }
    return {
      code: 200,
      result: '删除成功',
    };
  }
}
