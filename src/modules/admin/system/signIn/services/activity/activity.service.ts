import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { TBackground } from '@src/types';

@Injectable()
export class ActivityService {
  constructor(private httpService: HttpService) {}
  getActivityList(): Promise<AxiosResponse<TBackground>> {
    return this.httpService.axiosRef.get(
      `https://api.btstu.cn/sjbz/api.php?lx=dongman&format=json`,
    );
  }

  getActivityDetail() {}

  addActivity() {}

  removeActivity() {}
}
