import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EProductStatus, ESaleStatus } from '../entities/product.entity';

export class ProductListDto {
  @IsOptional()
  @IsNumber()
  productTypeId?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsEnum(EProductStatus)
  status: number;

  @IsOptional()
  @IsEnum(ESaleStatus)
  saleStatue: number;

  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  pageSize: number;
}

export class DelProductDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}

export class AddProductDto {
  @IsNotEmpty()
  @IsNumber()
  productTypeId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  subTitle: string;

  @IsOptional()
  @IsString()
  desc: string;

  @IsOptional()
  @IsString()
  imgSrc: string;

  @IsOptional()
  @IsString()
  videoSrc: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsEnum(EProductStatus)
  status: number;

  @IsOptional()
  @IsEnum(ESaleStatus)
  saleStatue: number;
}

export class EditProductDto extends AddProductDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsOptional()
  @IsNumber()
  productTypeId: number;

  @IsOptional()
  @IsNumber()
  price: number;
}

export class SendNoticeDto {
  @IsNotEmpty()
  @IsNumber()
  clubId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  platform: number;
}
