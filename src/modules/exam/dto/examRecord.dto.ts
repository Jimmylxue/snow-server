import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EExamProjectType } from '../entities/examRecord.entity';

export class CompleteExamDto {
  @IsNotEmpty()
  @IsEnum(EExamProjectType)
  examType: number;

  @IsNotEmpty()
  @IsString()
  desc: string;

  @IsNotEmpty()
  @IsNumber()
  useTime: number;

  @IsNotEmpty()
  @IsNumber()
  remainTime: number;

  @IsNotEmpty()
  @IsNumber()
  overTime: number;
}
