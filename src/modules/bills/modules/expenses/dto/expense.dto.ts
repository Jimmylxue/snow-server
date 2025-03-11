import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ExpenseListDTO {
  @IsOptional()
  @IsInt()
  expenseTypeId?: number;

  @IsOptional()
  @IsString()
  name?: string;

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

export class ExpenseDetailDTO {
  @IsNotEmpty()
  @IsInt()
  id: number;
}

export class ExpenseAddDTO {
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

  @IsNotEmpty()
  @IsString()
  use_time: string;
}

export class ExpenseUpdateDTO {
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

export class ExpenseDelDTO {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
