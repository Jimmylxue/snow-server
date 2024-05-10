import { Body, Controller, Post } from '@nestjs/common';
import { TransDetailDto, TransListDto } from './dto/train.dto';
import { TrainService } from './train.service';

@Controller('train')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  @Post('/trains')
  async getTrainList(@Body() body: TransListDto) {
    return await this.trainService.getTrainList(body);
  }

  /**
   * 某趟列车详情
   */
  @Post('/detail')
  async followTrain(@Body() body: TransDetailDto) {
    return await this.trainService.getTrainDetail(body);
  }
}
