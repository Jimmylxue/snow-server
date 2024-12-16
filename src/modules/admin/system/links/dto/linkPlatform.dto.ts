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
import { ELinkOpenStatus } from '../entities/linkPlatform.entity';

export class LinkTypeListDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort: 'ASC' | 'DESC';

  @IsOptional()
  @IsNumber()
  linkTypeId: number;

  @IsOptional()
  @IsEnum(ELinkOpenStatus)
  openStatus: number;

  @IsOptional()
  @IsString()
  startTime: string;

  @IsOptional()
  @IsString()
  endTime: string;
}

export class AddLinkTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(ELinkOpenStatus)
  openStatus: number;

  @IsNotEmpty()
  @IsString()
  mainImage: string;
}

export class DelLinkTypeDto {
  @IsNotEmpty()
  @IsNumber()
  linkTypeId: number;
}

export class UpdateLinkTypeDto {
  @IsNotEmpty()
  @IsNumber()
  linkTypeId: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  mainImage: string;

  @IsOptional()
  @IsEnum(ELinkOpenStatus)
  openStatus: number;
}

export class LinkTypeDetailDto {
  @IsNotEmpty()
  @IsInt()
  linkTypeId: number;
}
