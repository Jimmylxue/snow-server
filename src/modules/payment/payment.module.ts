import { Module } from '@nestjs/common';
import { WeChatPaymentModule } from './wechat/wechat.module';

@Module({
  imports: [WeChatPaymentModule],
  providers: [],
  controllers: [],
})
export class PaymentModule {}
