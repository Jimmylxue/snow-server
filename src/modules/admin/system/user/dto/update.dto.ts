import {
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePhoneDto {
  @IsMobilePhone('zh-CN')
  @IsOptional()
  phone: string;

  @IsMobilePhone('zh-CN')
  @IsNotEmpty({ message: '新手机号不能为空' })
  newPhone: string;
}

export class UpdateMailDto {
  @IsString()
  @IsOptional()
  mail: string;

  @IsNotEmpty({ message: '验证码-不能为空' })
  @IsString({ message: '验证码-类型错误' })
  code: string;

  @IsString()
  @IsNotEmpty({ message: '新邮箱不能为空' })
  newMail: string;
}
