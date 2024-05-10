import { IsNotEmpty, IsString } from 'class-validator';

export class FanYiDto {
  @IsNotEmpty({ message: '翻译文本不能为空' })
  q: string | number;

  @IsString({ message: '被翻译的语种必须是字符类型' })
  from: string;

  @IsString({ message: '要翻译的语种必须是字符类' })
  to: string;
}

export class CheckLanguageDto {
  @IsNotEmpty({ message: '检查语种-不能为空' })
  @IsString({ message: '检查语种-必须是字符类' })
  q: string;
}

export class PictureTranslateDto {
  @IsString({ message: '被翻译的语种必须是字符类型' })
  from: string;

  @IsString({ message: '要翻译的语种必须是字符类' })
  to: string;
}
