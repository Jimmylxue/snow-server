import { Module } from '@nestjs/common';
import { VitalityReminderModule } from './vitalityReminder/vitality.module';
import { WxController } from './wx.controller';
import { NodeMailerService } from '../shared/service/nodermailer/nodemailer.service';
import { WxConnectService } from './connect/connect.service';
import { HttpModule } from '@nestjs/axios';
import { LoggerService } from '../shared/service/Logger.service';

@Module({
  imports: [HttpModule, VitalityReminderModule],
  controllers: [WxController],
  providers: [LoggerService, NodeMailerService, WxConnectService],
})
export class WxModule {}
