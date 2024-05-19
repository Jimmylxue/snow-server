import { IsMobilePhone, IsNotEmpty, IsNumber } from 'class-validator';

export class AddRecordDto {
  @IsNotEmpty()
  @IsMobilePhone('zh-CN')
  phone: string;
}

export class RemoveRecordDto {
  @IsNotEmpty()
  @IsNumber()
  childrenId: number;
}
