import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class DoubaoProcessImageDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];

  @IsNotEmpty()
  @IsString()
  prompt: string;

  @IsOptional()
  @IsBoolean()
  returnUrl: boolean;
}
