import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Background } from '../../user/entities/background.entity';
import { BackgroundService } from '../services/background/background.service';
import { BackgroundController } from '../controllers/background/background.controller';
import { HttpModule } from '@nestjs/axios';
import { BingBgController } from '../controllers/background/bingBg.controller';
import { BingBgService } from '../services/background/bingBg.service';
import { Background } from '../entities/background.entity';
import { BingBgStore } from '../entities/bingBgStore.entity';
import { LoggerService } from '@src/modules/shared/service/Logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Background, BingBgStore]), HttpModule],
  providers: [BackgroundService, BingBgService, LoggerService],
  controllers: [BackgroundController, BingBgController],
  // exports: [TypeOrmModule],
})
export class ResourceModule {}
