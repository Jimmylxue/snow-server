import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { FanYiDto } from '../../controllers/baiduFanYi/dto/baiduFanYi.dto';
import { MD5 } from '@src/utils';
const md5 = require('md5');
import urllib from 'urllib';
import { ConfigService } from '@nestjs/config';
import { TBackTranslateInfo } from '@src/types';
@Injectable()
export class TranslateService {
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  translate({
    from,
    to,
    q,
  }: FanYiDto): Promise<AxiosResponse<TBackTranslateInfo>> {
    const appid = this.configService.get('BAIDU_APPID');
    const key = this.configService.get('BAIDU_KEY');
    const salt = new Date().getTime();
    const beforeSign = String(appid + q + salt + key).trim();
    const sign = MD5(beforeSign);
    return this.httpService.axiosRef.get(
      `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURI(
        String(q),
      )}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`,
    );
  }

  checkLanguage(q: string) {
    const appid = this.configService.get('BAIDU_APPID');
    const key = this.configService.get('BAIDU_KEY');
    const salt = new Date().getTime();
    const beforeSign = String(appid + q + salt + key).trim();
    const sign = MD5(beforeSign);
    return this.httpService.axiosRef.get<
      any,
      {
        error_code: number;
        error_msg: string;
        data?: {
          src: string;
        };
      }
    >(
      `https://fanyi-api.baidu.com/api/trans/vip/language?q=${encodeURI(
        String(q),
      )}&appid=${appid}&salt=${salt}&sign=${sign}`,
    );
  }

  async pictureTranslate({ from, to }, file) {
    const appid = this.configService.get('BAIDU_APPID');
    const key = this.configService.get('BAIDU_KEY');
    const sk = key;
    const cuid = 'APICUID';
    const mac = 'mac';
    const salt = new Date().getTime();
    const sign = md5(`${appid}${md5(file)}${salt}${cuid}${mac}${sk}`);
    const res = await urllib.request(
      'https://fanyi-api.baidu.com/api/trans/sdk/picture',
      {
        method: 'POST',
        data: {
          from,
          to,
          appid,
          salt,
          cuid,
          mac,
          sign,
        },
        files: {
          image: file,
        },
        contentType: 'multipart/form-data',
        dataType: 'json',
      },
    );
    return res.data;
  }
}
