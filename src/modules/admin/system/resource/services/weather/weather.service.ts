import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { TBackWeatherInfo } from '@src/types';
@Injectable()
export class WeatherService {
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  getWeather(cityName: string): Promise<AxiosResponse<TBackWeatherInfo>> {
    const key = this.configService.get('JUHE_WEATHER_KEY');
    return this.httpService.axiosRef.get(
      `http://apis.juhe.cn/simpleWeather/query?city=${encodeURI(
        cityName,
      )}&key=${key}`,
    );
  }
}
