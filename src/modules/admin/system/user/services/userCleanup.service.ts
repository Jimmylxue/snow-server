import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserCleanupService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  // 每分钟执行一次
  @Cron('*/1 * * * *', {
    name: 'every_hour_check',
    timeZone: 'Asia/Chongqing',
  })
  async handleCron() {
    // 检查环境变量是否开启
    const isEnabled = this.configService.get('UNIQUE_LOGIN_STATE') === '1';

    if (isEnabled) {
      await this.userService.cleanUpCheck();
    }
  }
}
