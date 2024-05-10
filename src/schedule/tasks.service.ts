import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private httpService: HttpService) {}
  // 从右往左看  每天 9 点 0 分 10 秒
  @Cron('10 00 09 * * *', {
    name: 'everyday_send',
    timeZone: 'Asia/Chongqing',
  })
  async handleCron() {
    await this.httpService.axiosRef.get(
      'http://www.jimmyxuexue.top:9999/vitality/today',
    );
    setTimeout(() => {
      this.httpService.axiosRef.get(
        'http://www.jimmyxuexue.top:9999/vitality/important',
      );
    }, 1000);
  }

  @Cron('10 00 09 * * *', {
    name: 'store_bing_bg',
    timeZone: 'Asia/Chongqing',
  })
  // 每日自动保存图片
  async handleStoreBingBg() {
    await this.httpService.axiosRef.get(
      'https://api.jimmyxuexue.top/bingBg/store',
    );
  }
}
