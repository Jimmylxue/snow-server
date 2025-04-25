import { Module } from '@nestjs/common';
import { WeChatPaymentController } from './wechat.controller';
import { HttpModule } from '@nestjs/axios';
import { WeChatPaymentService } from './wechat.service';
import { UsersModule } from '@src/modules/admin/system/user/modules/user.module';
import { OrderModule } from '@src/modules/admin/system/order/order.module';
@Module({
  imports: [HttpModule, UsersModule, OrderModule],
  controllers: [WeChatPaymentController],
  providers: [WeChatPaymentService],
})
export class WeChatPaymentModule {}
