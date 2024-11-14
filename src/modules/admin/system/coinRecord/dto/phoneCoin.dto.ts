import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PhoneCoinListDto {
  @IsOptional()
  @IsString()
  startTime: string;

  @IsOptional()
  @IsString()
  endTime: string;

  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  pageSize: number;

  @IsOptional()
  @IsString()
  phone: string;
}
