import {
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { EProductTypes } from '../entities/address.entity';

export class DelAddressDto {
  @IsNotEmpty()
  @IsNumber()
  addressId: number;
}

export class FBDto {
  @IsOptional()
  @IsString()
  fbp: string;

  @IsOptional()
  @IsString()
  fbc: string;
}

export class AddAddressDto extends FBDto {
  @IsNotEmpty()
  @IsString()
  province: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  area: string;

  @IsNotEmpty()
  @IsString()
  detail: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  // @IsMobilePhone('zh-CN')
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  shop: string;

  @IsNotEmpty()
  @IsString()
  memberCode: string;

  @IsOptional()
  @IsEnum(EProductTypes)
  productType: number;

  @IsOptional()
  @IsString()
  sku: string;
}

export class EditConfigDto {
  @IsOptional()
  @IsString()
  lineCode: string;

  @IsOptional()
  @IsString()
  inviteCode: string;
}

export class EditAddressDto {
  @IsNotEmpty()
  @IsNumber()
  addressId?: number;

  @IsOptional()
  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  area: string;

  @IsOptional()
  @IsString()
  detail: string;
}

export class AddressListDto extends EditAddressDto {
  @IsOptional()
  @IsNumber()
  addressId?: number;

  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  pageSize: number;
}

export class ECheckLinkDto {
  @IsNotEmpty()
  @IsString()
  linkCode: string;
}
