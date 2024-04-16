import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ClubListDto {
  @IsOptional()
  @IsNumber()
  clubId?: number;
}

export class SignUpDto {
  @IsOptional()
  @IsNumber()
  clubId?: number;
}

export class AddClubDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  desc: string;
}
