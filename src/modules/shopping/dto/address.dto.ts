import {
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class DelAddressDto {
  @IsNotEmpty()
  @IsNumber()
  addressId: number;
}

export class AddAddressDto {
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

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsMobilePhone('zh-CN')
  @IsNotEmpty()
  phone: string;
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
}
