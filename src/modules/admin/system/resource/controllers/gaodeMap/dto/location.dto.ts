import { IsNotEmpty, IsNumber } from 'class-validator';

export class GeoDto {
  @IsNotEmpty()
  @IsNumber()
  latitude: string;

  @IsNotEmpty()
  @IsNumber()
  longitude: string;
}
