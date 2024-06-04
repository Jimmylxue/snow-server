import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductListDto {
  @IsOptional()
  @IsNumber()
  productTypeId?: number;

  @IsOptional()
  @IsString()
  title?: string;
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
