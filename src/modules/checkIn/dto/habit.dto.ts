import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EFrequency, ENotifyTime, EStatus } from '../entities/habit.entity';

export class HabitListDto {
  @IsOptional()
  @IsEnum(EStatus)
  status?: EStatus;

  @IsOptional()
  @IsNumber()
  habitId?: number;
}

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

export class UpdateHabitStatusDto {
  @IsNotEmpty()
  @IsNumber()
  habitId: number;

  @IsNotEmpty()
  @IsEnum(EStatus)
  status: EStatus;
}

export class DelHabitDto {
  @IsNotEmpty()
  @IsNumber()
  habitId: number;
}
