import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class IncomeTypeListDTO {
  @IsOptional()
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  name: string;
}

export class IncomeTypeDetailDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class IncomeTypeAddDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  cover: string;
}

export class IncomeTypeUpdateDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  cover: string;
}

export class IncomeTypeDelDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
