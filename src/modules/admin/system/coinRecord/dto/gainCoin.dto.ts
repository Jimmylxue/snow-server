import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CGainCoinRecordDto {
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

export class GainCoinRecordDto extends CGainCoinRecordDto {
  @IsOptional()
  @IsNumber()
  userId: number;
}

export class GainCoinDto {
  @IsNotEmpty()
  @IsNumber()
  linkId: number;
}
