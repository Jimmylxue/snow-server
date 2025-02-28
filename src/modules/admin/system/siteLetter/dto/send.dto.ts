import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EPlatform } from '../entities/letter.entity';
import { EStatus } from '../entities/sendRecord.entity';

export class sendLetterDto {
  @IsEnum(EPlatform)
  platform: number;

  @IsString()
  title: string;

  @IsString()
  content: string;
}

export class sendSomeDto {
  @IsArray()
  @IsNumber({}, { each: true })
  userIds: number[];

  @IsNumber()
  letterId: number;
}

export class sendAllDto {
  @IsNumber()
  letterId: number;
}

export class recordListDto {
  @IsNumber()
  letterId: number;
}

export class recordUserDto {
  @IsNumber()
  letterId: number;

  @IsEnum(EStatus)
  status: number;
}

export class userRecordDto {
  @IsOptional()
  @IsEnum(EStatus)
  status: number;

  @IsOptional()
  @IsEnum(EPlatform)
  platform: number;
}

export class userReadDto {
  @IsOptional()
  @IsEnum(EStatus)
  status: number;

  @IsOptional()
  @IsNumber()
  recordId: number;
}
