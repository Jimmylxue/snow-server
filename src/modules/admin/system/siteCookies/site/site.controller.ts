import { Controller, Get } from '@nestjs/common';
import { SiteService } from './site.service';
@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get('/list')
  async getBaseInfo() {
    const siteList = await this.siteService.getSiteList();
    if (!siteList) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    return {
      code: 200,
      result: siteList,
    };
  }
}
