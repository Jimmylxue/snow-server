import { IsNotEmpty, IsString } from 'class-validator';

export class SendMailDto {
  @IsNotEmpty({ message: '邮箱地址不能为空' })
  @IsString({ message: '邮箱地址类型错误' })
  mail: string;
}
