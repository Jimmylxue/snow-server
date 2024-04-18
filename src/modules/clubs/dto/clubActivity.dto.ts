import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ClubActivityListDto {
  @IsOptional()
  @IsNumber()
  clubActivityId?: number;
}

export class ClubActivitySignListDto {
  @IsOptional()
  @IsNumber()
  clubActivityId?: number;
}

export class ClubActivityFeedbackListDto {
  @IsOptional()
  @IsNumber()
  clubActivityId?: number;
}

export class SignUpActivityDto {
  @IsOptional()
  @IsNumber()
  clubActivityId?: number;
}

export class AddClubActivityDto {
  @IsNotEmpty()
  @IsNumber()
  clubId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  desc: string;

  @IsNotEmpty()
  @IsNumber()
  signStartTime: number;

  @IsNotEmpty()
  @IsNumber()
  signEndTime: number;
}

export class FeedBackDto {
  @IsNotEmpty()
  @IsNumber()
  clubId: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  clubActivityId: number;
}

export class SignInDto {
  @IsNotEmpty()
  @IsNumber()
  clubId: number;

  @IsNotEmpty()
  @IsNumber()
  clubActivityId: number;
}
