import { Module } from '@nestjs/common';
import { VitalityReminderModule } from './vitalityReminder/vitality.module';
import { WxController } from './wx.controller';
import { NodeMailerService } from '../shared/service/nodermailer/nodemailer.service';
import { WxConnectService } from './connect/connect.service';
import { HttpModule } from '@nestjs/axios';
import { LoggerService } from '../shared/service/Logger.service';
import { SseModule } from '../sse/sse.module';

@Module({
  imports: [
    HttpModule,
    VitalityReminderModule,
    SseModule, // 这里配置一下
  ],
  controllers: [WxController],
  providers: [LoggerService, NodeMailerService, WxConnectService],
})
export class WxModule {}
