import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaveSettingDto {
  @IsNotEmpty()
  @IsNumber()
  disabledStartHour: number;

  @IsNotEmpty()
  @IsNumber()
  disabledEndHour: number;
}
