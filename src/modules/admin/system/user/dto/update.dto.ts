import {
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '../entities/user.entity';

export class UserListDto {
  @IsOptional()
  @IsMobilePhone('zh-CN')
  phone: string;

  @IsOptional()
  @IsString()
  openid: string;

  @IsOptional()
  @IsEnum(Role)
  role: number;

  @IsOptional()
  @IsString()
  mail: string;

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
}

export class DelUserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

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

export class ChangePasswordDto {
  @IsMobilePhone('zh-CN')
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  originPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
