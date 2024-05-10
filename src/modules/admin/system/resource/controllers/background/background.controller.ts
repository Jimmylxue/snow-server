import { Controller, Get, Query } from '@nestjs/common';
import { SystemException } from '@src/exception';
import { BackgroundService } from '../../services/background/background.service';
@Controller('background')
export class BackgroundController {
  constructor(private readonly backgroundService: BackgroundService) {}

  @Get('/base')
  async getBaseInfo() {
    const { data } = await this.backgroundService.getBackground();
    if (data.code === '200') {
      return {
        code: 200,
        result: data,
      };
    }
    throw new SystemException('THIRD_PART_SERVICE_ERROR_CODE', 200, '');
  }
}
