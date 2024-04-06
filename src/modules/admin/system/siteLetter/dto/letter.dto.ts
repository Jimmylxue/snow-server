import {
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { EPlatform } from '../entities/letter.entity';
import { sendLetterDto } from './send.dto';

export class LetterListDto {
  @IsNotEmpty()
  @IsInt()
  pageSize: number;

  @IsNotEmpty()
  @IsInt()
  page: number;

  @IsOptional()
  createTime: number;

  @IsOptional()
  title: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort: string;

  @IsOptional()
  @IsEnum(EPlatform)
  platform: number;

  @IsOptional()
  letterId: number;
}

export class UpdateLetterDto extends sendLetterDto {
  @IsNumber()
  letterId: number;

  @IsOptional()
  @IsEnum(EPlatform)
  platform: number;

  @IsOptional()
  content: string;
}

export class DelLetterDto {
  @IsNumber()
  letterId: number;
}
