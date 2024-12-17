import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RichTextListDto {
  @IsOptional()
  @IsNumber()
  richTextId: number;
}

export class UpdateRichTextDto {
  @IsNotEmpty()
  @IsNumber() // 确保数组中的每个元素都是数字
  richTextId: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  image: string;
}
