import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EFrequency, ENotifyTime, EStatus } from '../entities/habit.entity';

export class SignInDto {
  @IsNotEmpty()
  @IsNumber()
  habitId: number;

  @IsOptional()
  @IsString()
  signDate: string;
}

export class SignRecordDto {
  @IsOptional()
  @IsEnum(EStatus)
  status: number;

  @IsOptional()
  @IsNumber()
  habitId: number;

  @IsOptional()
  @IsString()
  signDate: string;

  @IsOptional()
  @IsString()
  signYear: string;

  @IsOptional()
  @IsString()
  signMonth: string;

  @IsOptional()
  @IsString()
  signDay: string;
}

export class HabitListDto {}

export class AddHabitDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(EFrequency)
  frequency: number;

  @IsOptional()
  @IsString()
  frequencyDay: string;

  @IsOptional()
  @IsNumber()
  frequencyWeek: number;

  @IsNotEmpty()
  @IsBoolean()
  notifyFlag: boolean;

  @IsOptional()
  @IsEnum(ENotifyTime)
  notifyTime: number;
}

export class UpdateHabitDto extends AddHabitDto {
  @IsNotEmpty()
  @IsNumber()
  habitId: number;
}

export class DelHabitDto {
  @IsNotEmpty()
  @IsNumber()
  habitId: number;
}
