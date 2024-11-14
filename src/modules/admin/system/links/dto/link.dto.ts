import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  price: number;

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
  @IsString()
  mainImage: string;

  @IsNotEmpty()
  @IsString()
  fullLink: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class DelLinkDto {
  @IsNotEmpty()
  @IsNumber()
  linkId: number;
}

export class UpdateLinkDto extends AddLinkDto {
  @IsNotEmpty()
  @IsNumber()
  linkId: number;
}
