import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BookListDTO {
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

export class BookDetailDTO {
  @IsNotEmpty()
  @IsInt()
  id: number;
}

export class BookAddDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  typeId: number;

  @IsNotEmpty()
  @IsString()
  source: string;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  cover: string;
}

export class BookUpdateDTO {
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
}

export class BookDelDTO {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
