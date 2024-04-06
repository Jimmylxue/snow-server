import { IsNotEmpty, IsString } from 'class-validator';

export class WxConfigParams {
  @IsNotEmpty({ message: 'url 不能为空' })
  @IsString({ message: 'url 必须为字符串类' })
  url: string;
}
