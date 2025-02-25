import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class BookTypeListDTO {
  @IsOptional()
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  name: string;
}

export class BookTypeDetailDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class BookTypeAddDTO {
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

export class BookTypeUpdateDTO {
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

export class BookTypeDelDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
