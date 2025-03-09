import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class IncomeListDTO {
  @IsOptional()
  @IsInt()
  typeId: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  pageSize: number;

  @IsNotEmpty()
  @IsInt()
  page: number;

  @IsOptional()
  @IsString()
  startTime: string;

  @IsOptional()
  @IsString()
  endTime: string;
}

export class IncomeDetailDTO {
  @IsNotEmpty()
  @IsInt()
  id: number;
}

export class IncomeAddDTO {
  @IsNotEmpty()
  @IsInt()
  typeId: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  cover: string;

  @IsNotEmpty()
  @IsInt()
  price: number;

  @IsOptional()
  @IsString()
  use_time: string;
}

export class IncomeUpdateDTO {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  source: string;

  @IsOptional()
  @IsString()
  cover: string;

  @IsOptional()
  @IsString()
  use_time: string;
}

export class IncomeDelDTO {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
