import { IsCustomDateFormat } from '@src/modules/shared/dto/customDate';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TransListDto {
  @IsString()
  @IsCustomDateFormat()
  date: string;

  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsIn(['ADULT', '0X00'])
  type: string;

  @IsOptional()
  @IsString()
  trainNo?: string;
}

export class TransDetailDto {
  @IsString()
  @IsCustomDateFormat()
  depart_date: string;

  @IsNotEmpty()
  @IsString()
  train_no: string;

  @IsNotEmpty()
  @IsString()
  from_station_telecode: string;

  @IsNotEmpty()
  @IsString()
  to_station_telecode: string;
}
