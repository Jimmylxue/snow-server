import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { TLocationByIp } from '@src/types';

@Injectable()
export class LocationService {
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async getLocationByIp(ip: string): Promise<AxiosResponse<TLocationByIp>> {
    const key = this.configService.get('GAODE_LOCATION_KEY');
    return this.httpService.axiosRef.get(
      `https://restapi.amap.com/v3/ip?ip=${ip}&output=json&key=${key}`,
    );
  }
}
