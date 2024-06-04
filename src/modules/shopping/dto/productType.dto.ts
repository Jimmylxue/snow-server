import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductTypeListDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  title?: string;
}

export class DelProductTypeDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class AddProductTypeDto {
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
}

export class EditProductTypeDto extends AddProductTypeDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  subTitle: string;

  @IsOptional()
  @IsString()
  desc: string;

  @IsOptional()
  @IsString()
  imgSrc: string;
}
