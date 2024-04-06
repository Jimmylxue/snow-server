import { HttpService } from '@nestjs/axios';
import { Controller, Get } from '@nestjs/common';
import { WxConnectService } from '../connect/connect.service';
import { baseMsg } from './core';
import { import_day_type } from './core/type';

@Controller('vitality')
export class VitalityController {
  constructor(
    private readonly wxService: WxConnectService,
    private httpService: HttpService,
  ) {}

  // 每日一句
  @Get('/today')
  async today() {
    const ACCESS_TOKEN = await this.wxService.getWxToken();
    const weatherRes = await this.httpService.axiosRef.get(
      'http://www.jimmyxuexue.top:9999/weather/base?cityName=%E7%A6%8F%E5%B7%9E',
    );
    if (weatherRes.data.code === 200 && ACCESS_TOKEN) {
      await this.wxService.sendTemplateMsg(
        ACCESS_TOKEN,
        weatherRes?.data?.result,
      );
    }
  }

  @Get('/important')
  async important() {
    const { flag } = baseMsg;
    if (flag === import_day_type.普通的日子) {
      // 普通日子 直接返回
      return;
    } else {
      try {
        const ACCESS_TOKEN = await this.wxService.getWxToken();
        if (ACCESS_TOKEN) {
          let res = await this.wxService.sendImportantTemplateMsg(ACCESS_TOKEN);
          console.log('重要日子返回', res);
        }
      } catch (error) {
        console.log('重要日子错误', error.message);
      }
    }
  }

  @Get('/getApiTick')
  async test() {
    const res = await this.wxService.getApkTicket();
    return 'hello world' + res;
  }
}
