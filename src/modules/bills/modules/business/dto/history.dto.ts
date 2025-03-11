import { IsOptional, IsString } from 'class-validator';

export class MonthRecordDTO {
  // @IsOptional()
  // @IsInt()
  // expenseTypeId: number;

  // @IsOptional()
  // @IsString()
  // name: string;

  // @IsNotEmpty()
  // @IsInt()
  // pageSize: number;

  // @IsNotEmpty()
  // @IsInt()
  // page: number;

  @IsOptional()
  @IsString()
  startTime: string;

  @IsOptional()
  @IsString()
  endTime: string;
}
