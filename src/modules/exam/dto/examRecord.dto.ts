import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CompleteExamDto {
  @IsNotEmpty()
  @IsNumber()
  examProjectId: number;

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

  @IsNotEmpty()
  @IsNumber()
  totalScore: number;
}

export class ExamScoreRankDto {
  @IsNumber()
  examProjectId: number;
}

export class ProjectDetailDto {
  @IsNotEmpty()
  @IsNumber()
  examProjectId: number;
}
