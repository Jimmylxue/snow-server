import { HttpCode, Injectable, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { TLocationByIp } from '@src/types';
import { GeoDto } from '../../controllers/gaodeMap/dto/location.dto';
import { AuthGuard } from '@nestjs/passport';

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

  /**
   * 逆地址解析 （根据经纬度 获取 城市等信息）
   */
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  async getLocationByGeo(params: GeoDto): Promise<AxiosResponse<any>> {
    const key = this.configService.get('GAODE_LOCATION_KEY');
    return this.httpService.axiosRef.get(
      `https://restapi.amap.com/v3/geocode/regeo?output=JSON&location=${params.longitude},${params.latitude}&key=${key}&radius=1000&extensions=all`,
    );
  }
}
