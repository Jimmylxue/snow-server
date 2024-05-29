import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EExamType } from '../entities/course.entity';

export class CourseTypeListDto {
  @IsOptional()
  @IsString()
  name: string;
}

export class AddCourseTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  desc: string;
}

export class EditCourseTypeDto {
  @IsNotEmpty()
  @IsNumber()
  id: string;

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

export class CourseListDto {
  @IsOptional()
  @IsNumber()
  typeId: number;
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

export class EditCourseDto {
  @IsNotEmpty()
  @IsNumber()
  id: string;

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

export class BuyCourseDto {
  @IsNotEmpty()
  @IsNumber()
  courseId: number;
}
