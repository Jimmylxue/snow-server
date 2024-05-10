import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { RedisInstance } from '@src/instance';
import { TBackground } from '@src/types';

@Injectable()
export class BackgroundService {
  constructor(private httpService: HttpService) {}
  async getBackground(): Promise<AxiosResponse<TBackground>> {
    const redis = await RedisInstance.initRedis();
    return this.httpService.axiosRef.get(
      `https://api.btstu.cn/sjbz/api.php?lx=dongman&format=json`,
    );
  }
}
