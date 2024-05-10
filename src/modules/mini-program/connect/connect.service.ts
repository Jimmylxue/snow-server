import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RedisInstance } from '@src/instance';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MiniProgramConnectService {
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getMiniProgramToken(): Promise<string> {
    const appID = this.configService.get('WX_MINI_PROGRAM_APPID');
    const AppSecret = this.configService.get('WX_MINI_PROGRAM_APPSECRET');
    const redis = await RedisInstance.initRedis();
    const miniProgramAccessToken = await redis.get(
      `snow-server-miniProgram-accessToken`,
    );
    if (
      !miniProgramAccessToken ||
      (miniProgramAccessToken &&
        JSON.parse(miniProgramAccessToken).deadline - 10000 <
          new Date().getTime())
    ) {
      console.log('从新从微信获取accect_token');
      // 过期或首次获取 => 直接取新的access_token
      let res = await this.httpService.axiosRef.get<{
        access_token: string;
        expires_in: number;
      }>(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${AppSecret}`,
      );
      if (res.data && res.data.access_token) {
        redis.set(
          'snow-server-miniProgram-accessToken',
          JSON.stringify({
            ...res.data,
            deadline: new Date().getTime() + res.data.expires_in * 1000,
          }),
        );
        console.log(
          'redisSaveData',
          JSON.stringify({
            ...res.data,
            deadline: new Date().getTime() + res.data.expires_in * 1000,
          }),
        );
        return res.data.access_token;
      } else {
        return '';
      }
    } else {
      console.log('token 来自redis');
      // 未过期 - 从redis中取出 access_token
      return JSON.parse(miniProgramAccessToken).access_token;
    }
  }
}
