import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { weChat } from '@src/config/wx';
import {
  baseMsg,
  getBirthday,
  getLoveDay,
  getPayDay,
} from '../vitalityReminder/core';
import { getTimes } from '@src/utils';
import { import_day_type } from '../vitalityReminder/core/type';
import { RedisInstance } from '@src/instance';
import { LoggerService } from '@src/modules/shared/service/Logger.service';
import { TBackWeatherInfo } from '@src/types';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';

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
      let res = await this.httpService.axiosRef.get<{
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
      let res = await this.httpService.axiosRef.get<{
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

  // @ts-ignore
  async sendTemplateMsg(
    access_token: string,
    weather: TBackWeatherInfo['result'],
  ): Promise<any> {
    const { love_message } = weChat;

    const base_templateId = this.configService.get(
      'WX_OFFICIAL_BASE_TEMPLATE_ID',
    );

    const day = getTimes(); // 当前日期
    const loveDay = getLoveDay(); // 相恋天数
    const birthday = Number(getBirthday()) + 1; // 生日天数  +1 是为了兼容显示 让几个小时也显示是1天
    const payDay = getPayDay(); // 发薪日
    const realtime = weather.realtime;
    const template = {
      touser: 'owxjL6XMOesGkSp6gjT8KVno-ikc',
      template_id: base_templateId,
      topcolor: '#FF0000',
      data: {},
    };
    // 日常模板
    const base_temp = {
      dateTime: {
        value: day,
        color: '#cc33cc',
      },
      love: {
        value: loveDay,
        color: '#ff3399',
      },
      pay: {
        value: payDay,
        color: '#66ff00',
      },
      birthday: {
        value: birthday,
        color: '#ff0033',
      },
      weather: {
        value: realtime?.info,
        color: '#33ff33',
      },
      temp: {
        value: realtime?.temperature,
        color: '#0066ff',
      },
      humidity: {
        value: realtime?.humidity,
        color: '#ff0033',
      },
      wind: {
        value: realtime?.direct + realtime?.power,
        color: '#3399ff',
      },
      message: {},
    };

    base_temp.message =
      love_message[Math.floor(Math.random() * love_message.length)];
    template.data = base_temp;
    template.template_id = base_templateId;

    let res = await this.httpService.axiosRef.post<any>(
      `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`,
      template,
    );
    if (res.data.errcode !== 0) {
      this.logger.log(
        JSON.stringify({ message: '微信群发错误', detail: res.data }),
      );
    }
    return res;
  }

  async sendImportantTemplateMsg(access_token: string): Promise<any> {
    const base_templateId = this.configService.get(
      'WX_OFFICIAL_BASE_TEMPLATE_ID',
    );
    const pay_templateId = this.configService.get(
      'WX_OFFICIAL_PAY_TEMPLATE_ID',
    );
    const birthday_templateId = this.configService.get(
      'WX_OFFICIAL_BIRTHDAY_TEMPLATE_ID',
    );
    const love_templateId = this.configService.get(
      'WX_OFFICIAL_LOVE_TEMPLATE_ID',
    );
    const day = getTimes(); // 当前日期
    const { individual, anniversary, flag } = baseMsg;
    const template = {
      touser: 'owxjL6XMOesGkSp6gjT8KVno-ikc',
      template_id: base_templateId,
      topcolor: '#FF0000',
      data: {},
    };

    const birth_temp = {
      dateTime: {
        value: day,
        color: '#cc33cc',
      },
      individual: {
        value: individual,
        color: '#0066ff',
      },
    };

    // 工资模板
    const pay_temp = {
      dateTime: {
        value: day,
        color: '#cc33cc',
      },
    };

    // 相恋模板
    const love_temp = {
      dateTime: {
        value: day,
        color: '#cc33cc',
      },
      anniversary: {
        value: anniversary,
        color: '#0066ff',
      },
    };

    switch (flag) {
      case import_day_type.发薪日:
        template.data = pay_temp;
        template.template_id = pay_templateId;
        return;
      case import_day_type.生日:
        template.data = birth_temp;
        template.template_id = birthday_templateId;
        return;
      case import_day_type.相恋纪念日:
        template.data = love_temp;
        template.template_id = love_templateId;
        return;
      default:
        break;
    }

    let res = await this.httpService.axiosRef.post(
      `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`,
      template,
    );
    return res;
  }
}
