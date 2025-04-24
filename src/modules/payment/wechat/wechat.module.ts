import { Module } from '@nestjs/common';
import { WeChatPaymentController } from './wechat.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WeChatPaymentController],
})
export class WeChatPaymentModule {}
