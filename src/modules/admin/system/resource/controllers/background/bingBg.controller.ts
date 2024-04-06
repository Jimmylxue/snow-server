import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { SystemException } from '@src/exception';
import { BingBgService } from '../../services/background/bingBg.service';
import { BingBgDto, loveStatus } from './dto/bingBg.dto';
import { LoggerService } from '@src/modules/shared/service/Logger.service';

@Controller('bingBg')
export class BingBgController {
  constructor(
    private readonly bingBgService: BingBgService,
    @Inject(LoggerService) private readonly logger: LoggerService,
  ) {}

  @Get('/weekList')
  async getWeekBackgroundList() {
    let resData: any = {};
    const data = await this.bingBgService.getBackground();
    if (data) {
      resData = {
        code: 200,
        result: data,
      };
    } else {
      // 第三方错误
      throw new SystemException('THIRD_PART_SERVICE_ERROR_CODE', 200, '');
    }
    return resData;
  }

  @Get('/today')
  async getTodayBg(@Query() req: BingBgDto) {
    let resData: any = {};
    const data = await this.bingBgService.getBackground();
    if (data) {
      // 高清
      resData = {
        code: 200,
        result: `https://cn.bing.com/${data?.images?.[0].urlbase}_${
          !JSON.parse(req.UHD) ? '1920x1080' : 'UHD'
        }.jpg`,
      };
    } else {
      // 第三方错误
      throw new SystemException('THIRD_PART_SERVICE_ERROR_CODE', 200, '');
    }
    return resData;
  }

  @Post('/love')
  async loveImage(@Body() body: loveStatus) {
    const res = await this.bingBgService.addImage(body);
    if (res.status === 0) {
      return { code: 500, message: res.message };
    }
    return {
      code: 200,
      message: res.message,
    };
  }

  // 将每日图片保存一份至数据库
  @Get('/store')
  async storeTodayBg() {
    const data = await this.bingBgService.storeTodayBg();
    if (data.code !== 200) {
      // 日志上报
      this.logger.log(JSON.stringify({ ...data, path: '/bingBg/store' }));
    }
    return data;
  }
}
