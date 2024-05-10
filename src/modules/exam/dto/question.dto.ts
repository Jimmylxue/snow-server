import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EExamType } from '../entities/question.entity';

export class QuestionTypeListDto {
  @IsOptional()
  @IsString()
  name: string;
}

export class AddQuestionTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  desc: string;
}

export class DelQuestionTypeDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class QuestionListDto {
  @IsOptional()
  @IsNumber()
  typeId: number;

  @IsOptional()
  @IsEnum(EExamType)
  examType: number;
}

export class AddQuestionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  desc: string;

  @IsNotEmpty()
  @IsEnum(EExamType)
  examType: number;

  @IsNotEmpty()
  @IsNumber()
  typeId: number;

  @IsOptional()
  @IsString()
  option: string;

  @IsOptional()
  @IsString()
  answer: string;
}

export class DelQuestionDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class RandomQuestionDto {
  @IsOptional()
  @IsNumber()
  count: number;
}
