import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ELinkType } from '../entities/links.entity';

export class LinkListDto {
  @IsNotEmpty()
  @IsInt()
  pageSize: number;

  @IsNotEmpty()
  @IsInt()
  page: number;

  @IsOptional()
  @IsString()
  createTime: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort: 'ASC' | 'DESC';

  @IsOptional()
  @IsNumber()
  linkId: number;

  @IsOptional()
  @IsNumber()
  linkTypeId: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  coin: number;

  @IsOptional()
  @IsNumber()
  visitTime: number;

  @IsOptional()
  @IsString()
  startTime: string;

  @IsOptional()
  @IsString()
  endTime: string;
}

export class AddLinkDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  linkTypeId: number;

  @IsNotEmpty()
  @IsString()
  mainImage: string;

  @IsNotEmpty()
  @IsString()
  fullLink: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @Min(0.01)
  @Max(300)
  coin: number;

  @IsOptional()
  @Min(1)
  @Max(300)
  visitTime: number;
}

export class DelLinkDto {
  @IsNotEmpty()
  @IsArray() // 确保是数组
  @ArrayNotEmpty() // 确保数组不为空
  @IsNumber({}, { each: true }) // 确保数组中的每个元素都是数字
  linkIds: number[];
}

export class UpdateLinkDto {
  @IsNotEmpty()
  @IsArray() // 确保是数组
  @ArrayNotEmpty() // 确保数组不为空
  @IsNumber({}, { each: true }) // 确保数组中的每个元素都是数字
  linkIds: number[];

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  mainImage: string;

  @IsOptional()
  @IsString()
  fullLink: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @Min(0.01)
  // @Max(50)
  coin: number;

  @IsOptional()
  @Min(1)
  @Max(180)
  visitTime: number;
}

export class CLinkListDto {
  @IsOptional()
  @IsNumber()
  pageSize: number;

  @IsNotEmpty()
  @IsNumber()
  linkTypeId: number;
}

export class LinkDetailDto {
  @IsNotEmpty()
  @IsInt()
  linkId: number;
}

export class UpdateLinkAllDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  linkTypeId: number;

  @IsOptional()
  @IsString()
  mainImage: string;

  @IsOptional()
  @IsString()
  fullLink: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @Min(0.01)
  // @Max(50)
  coin: number;

  @IsOptional()
  @Min(1)
  @Max(180)
  visitTime: number;
}
