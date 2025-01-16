import {
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { EPayStatus } from '../entities/withdrawalRecord.entity';

export class CWithdrawalRecordDto {
  @IsOptional()
  @IsString()
  startTime: string;

  @IsOptional()
  @IsEnum(EPayStatus)
  payStatus: number;

  @IsOptional()
  @IsString()
  endTime: string;

  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  pageSize: number;

  @IsOptional()
  @IsString()
  phone: string;
}

export class WithdrawalRecordDto extends CWithdrawalRecordDto {
  @IsOptional()
  @IsNumber()
  userId: number;
}

export class CarryWithdrawalDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  withdrawalCoin: number;
}

export class CompleteWithdrawalDto {
  @IsNotEmpty()
  @IsNumber()
  recordId: number;
}

export class CancelWithdrawalDto {
  @IsNotEmpty()
  @IsNumber()
  recordId: number;
}

export class WithdrawalDetailDto {
  @IsNotEmpty()
  @IsNumber()
  recordId: number;
}

export class WithdrawSummaryDto {
  @IsNotEmpty()
  @IsMobilePhone('zh-CN')
  @IsNotEmpty({ message: 'phone不能为空' })
  phone: string;
}
