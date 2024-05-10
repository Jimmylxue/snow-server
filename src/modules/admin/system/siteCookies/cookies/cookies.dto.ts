import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DetailCookiesParams {
  @IsNotEmpty({ message: 'website_id不能为空' })
  @IsNumber({}, { message: 'website_id-参数类型错误' })
  website_id: number;

  @IsNotEmpty({ message: 'website_id不能为空' })
  @IsNumber(
    {},
    {
      message: '用户id必须是数字',
    },
  )
  userId: number;
}

export class UpdateCookiesParams {
  @IsNotEmpty({ message: 'website_id不能为空' })
  @IsNumber({}, { message: 'website_id-参数类型错误' })
  website_id: number;

  @IsNotEmpty({ message: 'website_id不能为空' })
  @IsNumber(
    {},
    {
      message: '用户id必须是数字',
    },
  )
  userId: number;

  @IsNotEmpty({ message: 'website_id不能为空' })
  @IsString({ message: 'cookies类型必须为字符串类型' })
  cookies: string;
}
