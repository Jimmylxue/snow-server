import { IsBooleanString, IsString } from 'class-validator';

export class BingBgDto {
  @IsBooleanString({ message: 'UHD-参数类型错误' })
  UHD: string;
}

export class loveStatus {
  @IsString({ message: 'background-参数类型错误' })
  background: string;

  @IsString({ message: 'date-参数类型错误' })
  date: string;
}
