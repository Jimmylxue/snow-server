import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RedisInstance } from '@src/instance';
import { LoggerService } from '@src/modules/shared/service/Logger.service';
import { ConfigService } from '@nestjs/config';
import { TUserInfoParamsDto } from '../dto/wx.dto';

@Injectable()
export class WxConnectService {
  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpService,
    @Inject(LoggerService) private readonly logger: LoggerService,
  ) {}

  /**
   * 获取微信 jssdk 的 access_token
   * @returns {Promise<string>}
   */
  async getWxToken(): Promise<string> {
    const appID = this.configService.get('WX_OFFICIAL_APPID');
    const AppSecret = this.configService.get('WX_OFFICIAL_APPSECRET');
    const redis = await RedisInstance.initRedis();
    const wxAccessToken = await redis.get(`snow-server-wx-accessToken`);
    if (
      !wxAccessToken ||
      (wxAccessToken &&
        JSON.parse(wxAccessToken).deadline - 10000 < new Date().getTime())
    ) {
      console.log('重新获取access_token');
      // 过期或首次获取 => 直接取新的access_token
      const res = await this.httpService.axiosRef.get<{
        access_token: string;
        expires_in: number;
      }>(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${AppSecret}`,
      );
      if (res.data && res.data.access_token) {
        redis.set(
          'snow-server-wx-accessToken',
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
      return JSON.parse(wxAccessToken).access_token;
    }
  }

  /**
   * 获取微信 jssdk 的 jsapi_ticket
   * @returns {Promise<string>}
   */
  async getApkTicket(): Promise<string> {
    const assessToken = await this.getWxToken();
    const redis = await RedisInstance.initRedis();
    const wxJsApiTicket = await redis.get(`snow-server-wx-jsapi_ticket`);
    if (
      !wxJsApiTicket ||
      (wxJsApiTicket &&
        JSON.parse(wxJsApiTicket).deadline - 10000 < new Date().getTime())
    ) {
      console.log('重新获取 jsapi_ticket');
      // 过期或首次获取 => 直接取新的access_token
      const res = await this.httpService.axiosRef.get<{
        ticket: string;
        expires_in: number;
      }>(
        `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${assessToken}&type=jsapi`,
      );
      if (res.data && res.data.ticket) {
        redis.set(
          'snow-server-wx-jsapi_ticket',
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
        return res.data.ticket;
      } else {
        return '';
      }
    } else {
      console.log('apitick 来自redis');
      // 未过期 - 从redis中取出 access_token
      return JSON.parse(wxJsApiTicket).ticket;
    }
  }

  /**
   * 这个是获取网页授权的信息，里面的 access_token 和 客户端配置的 access_token不是一个东西
   */
  async getUserOpenId(body: TUserInfoParamsDto) {
    const appID = this.configService.get('WX_OFFICIAL_APPID');
    const AppSecret = this.configService.get('WX_OFFICIAL_APPSECRET');
    const code = body.code;
    const res = await this.httpService.axiosRef.get<{
      access_token: string;
      expires_in: number;
      refresh_token: string;
      openid: string;
      scope: string;
      is_snapshotuser: number;
      unionid: string;
      errmsg?: string;
    }>(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appID}&secret=${AppSecret}&code=${code}&grant_type=authorization_code`,
    );
    if (res.data && res.data.access_token) {
      return res.data;
    } else {
      throw new Error(res.data.errmsg);
    }
  }
}
