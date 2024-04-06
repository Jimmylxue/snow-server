import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from '../../services/weather/weather.service';
import { WeatherDto } from './dto/weather.dto';
import { RedisInstance } from '@src/instance';
import { getTimes } from '@src/utils';
import { SystemException } from '@src/exception';
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/base')
  async getAllUser(@Query() req: WeatherDto) {
    let obj: any = {};
    const today = getTimes();
    const redis = await RedisInstance.initRedis();
    const weatherData = await redis.get(`snow-weather-${req.cityName}`);
    if (!weatherData || JSON.parse(weatherData)?.date !== today) {
      const { data } = await this.weatherService.getWeather(req.cityName);
      if (data.error_code === 0) {
        obj.code = 200;
        obj.result = data.result;
        obj.message = '查询成功';
        const saveData = {
          date: today,
          data,
        };
        await redis.set(
          `snow-weather-${req.cityName}`,
          JSON.stringify(saveData),
        );
      } else {
        throw new SystemException('THIRD_PART_SERVICE_ERROR_CODE', 200, {
          error_code: data.error_code,
          error_msg: data.reason,
        });
      }
    } else {
      const data = JSON.parse(weatherData);
      obj.code = 200;
      obj.result = data?.data?.result;
      obj.message = '查询成功';
    }
    return obj;
  }
}
