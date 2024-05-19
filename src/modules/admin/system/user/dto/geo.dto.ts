import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AddGeoRecordDto {
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @IsNotEmpty()
  @IsString()
  longitude: string;
}

export class GeoRecordListDto {
  @IsOptional()
  @IsNumber()
  userId: number;
}
