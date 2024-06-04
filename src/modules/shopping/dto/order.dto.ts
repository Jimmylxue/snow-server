import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ProductItemDto {
  @IsString()
  title: string;

  @IsString()
  subTitle: string;

  @IsString()
  imgSrc: string;

  @IsNumber()
  price: number;
}

export class OrderListDto {
  @IsOptional()
  @IsNumber()
  orderId?: number;
}

export class DelOrderDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;
}

export class AddOrderDto {
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  orderDetail: string;

  @IsNotEmpty()
  @IsNumber()
  productCount: number;

  @IsNotEmpty()
  @IsString()
  province: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  area: string;

  @IsNotEmpty()
  @IsString()
  detail: string;
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
