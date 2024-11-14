import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { WxConnectService } from '../connect/connect.service';
import { VitalityController } from './vitality.controller';
import { VitalityService } from './vitality.service';
import { LoggerService } from '@src/modules/shared/service/Logger.service';

@Module({
  imports: [HttpModule],
  providers: [LoggerService, VitalityService, WxConnectService],
  controllers: [VitalityController],
  // exports: [TypeOrmModule],
})
export class VitalityReminderModule {}
