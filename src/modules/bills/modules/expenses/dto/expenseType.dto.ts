import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ExpenseTypeListDTO {
  @IsOptional()
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  name: string;
}

export class ExpenseTypeDetailDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class ExpenseTypeAddDTO {
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

export class ExpenseTypeUpdateDTO {
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

export class ExpenseTypeDelDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
