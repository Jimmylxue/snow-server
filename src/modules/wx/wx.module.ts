import { Module } from '@nestjs/common';
import { WxController } from './wx.controller';
import { NodeMailerService } from '../shared/service/nodermailer/nodemailer.service';
import { WxConnectService } from './connect/connect.service';
import { HttpModule } from '@nestjs/axios';
import { LoggerService } from '../shared/service/Logger.service';

@Module({
  imports: [HttpModule],
  controllers: [WxController],
  providers: [LoggerService, NodeMailerService, WxConnectService],
  exports: [WxConnectService],
})
export class WxModule {}
