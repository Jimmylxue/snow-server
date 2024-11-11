import {
  IsBoolean,
  IsIn,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoginDto {
  @IsMobilePhone('zh-CN')
  phone: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '类型错误' })
  password: string;

  @IsOptional()
  @IsBoolean()
  noEncrypt: boolean;
}

export class LoginByMailDto {
  @IsNotEmpty({ message: '验证码-不能为空' })
  @IsString({ message: '验证码-类型错误' })
  code: string;

  @IsNotEmpty({ message: '邮箱-不能为空' })
  @IsString({ message: '邮箱-类型错误' })
  mail: string;
}

export class LoginByMiniProgram {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
