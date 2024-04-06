import { HttpService } from '@nestjs/axios';
import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type TCode2SessionQuery = {
  code: string;
};

@Controller('mini')
export class MiniProgramController {
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/code2session')
  async code2session(@Query() { code }: TCode2SessionQuery) {
    const appID = this.configService.get('WX_MINI_PROGRAM_APPID');
    const AppSecret = this.configService.get('WX_MINI_PROGRAM_APPSECRET');
    const res = await this.httpService.axiosRef.get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${appID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`,
    );
    if (res.status === 200) {
      return { code: 200, ...res.data };
    }
    console.log({ res });
  }
}
