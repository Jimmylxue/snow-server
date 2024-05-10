import { IsNotEmpty, isString, IsString } from 'class-validator';

export class WeatherDto {
  @IsNotEmpty({ message: '城市名称不能为空' })
  cityName: string;
}
