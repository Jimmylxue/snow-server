import {
  IsArray,
  IsEnum,
  IsNotEmpty,
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

  @IsOptional()
  @IsString()
  imgUrl?: string;
}

export class sendSomeDto {
  @IsArray()
  @IsNumber({}, { each: true })
  userIds: number[];

  @IsNumber()
  letterId: number;
}

export class sendToPhoneDto {
  @IsArray()
  @IsString({ each: true }) // 验证每个元素都是字符串
  phones: string[];

  @IsNumber()
  letterId: number;
}

export class sendToAllPhoneDto {
  @IsNumber()
  letterId: number;
}

export class quickSendDto {
  @IsEnum(EPlatform)
  platform: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true }) // 验证每个元素都是字符串
  phones: string[];

  @IsOptional()
  @IsString()
  imgUrl?: string;
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

export class userPlatformReadDto {
  @IsOptional()
  @IsEnum(EStatus)
  status: number;

  @IsNotEmpty()
  @IsEnum(EPlatform)
  platform: number;
}
