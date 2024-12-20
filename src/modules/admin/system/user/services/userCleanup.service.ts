import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from './user.service';

@Injectable()
export class UserCleanupService {
  constructor(private userService: UserService) {}
  // 每半小时执行一次
  @Cron('*/1 * * * *', {
    name: 'every_hour_check',
    timeZone: 'Asia/Chongqing',
  })
  async handleCron() {
    await this.userService.cleanUpCheck();
  }
}
