import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EExamType } from '../entities/course.entity';

export class AddCourseTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  desc: string;
}

export class DelCourseTypeDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class AddCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  desc: string;

  @IsNotEmpty()
  @IsNumber()
  typeId: number;

  @IsNotEmpty()
  @IsString()
  cover: string;

  @IsNotEmpty()
  @IsString()
  source: string;
}

export class DelCourseDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class RandomCourseDto {
  @IsOptional()
  @IsNumber()
  count: number;
}
