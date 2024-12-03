import {
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
  @IsEnum(ELinkType)
  linkType: number;

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
  @IsEnum(ELinkType)
  linkType: number;

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
  @Max(50)
  coin: number;

  @IsOptional()
  @Min(1)
  @Max(60)
  visitTime: number;
}

export class DelLinkDto {
  @IsNotEmpty()
  @IsNumber()
  linkId: number;
}

export class UpdateLinkDto {
  @IsNotEmpty()
  @IsNumber()
  linkId: number;

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
  @Max(50)
  coin: number;

  @IsOptional()
  @Min(1)
  @Max(60)
  visitTime: number;
}

export class CLinkListDto {
  @IsOptional()
  @IsNumber()
  pageSize: number;

  @IsNotEmpty()
  @IsEnum(ELinkType)
  linkType: number;
}

export class LinkDetailDto {
  @IsNotEmpty()
  @IsInt()
  linkId: number;
}
