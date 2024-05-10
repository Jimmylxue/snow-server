import { Module } from '@nestjs/common';
import { TrainController } from './train.controller';
import { TrainService } from './train.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TrainService],
  controllers: [TrainController],
})
export class TrainModule {}
