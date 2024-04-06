import {
  IsIn,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @IsMobilePhone('zh-CN')
  @IsNotEmpty({ message: 'phone不能为空' })
  phone: string;

  sex: string;

  avatar: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '类型错误' })
  password: string;

  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '类型错误' })
  username: string;
}

export class RegisterByMailDto {
  @IsNotEmpty({ message: '邮箱-不能为空' })
  @IsString({ message: '邮箱-类型错误' })
  mail: string;

  // @IsNumberString({ message: '类型错误' })
  sex: string;

  // @IsString({ message: '类型错误' })
  avatar: string;

  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '类型错误' })
  username: string;

  @IsNotEmpty({ message: '验证码-不能为空' })
  @IsString({ message: '验证码-类型错误' })
  code: string;
}

export class UpdateDto {
  @IsOptional()
  @IsMobilePhone('zh-CN')
  @IsNotEmpty({ message: 'phone不能为空' })
  phone: string;

  // @IsNumberString({ message: '类型错误' })
  @IsOptional()
  @IsNumber({}, { message: '类型错误-必须是字符串类型' })
  @IsIn([0, 1, 2], {
    // message: '0 男 1 女',
  })
  sex: string;

  @IsOptional()
  @IsString({ message: '类型错误' })
  avatar: string;

  @IsOptional()
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '类型错误' })
  username: string;
}
