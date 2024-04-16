import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EChoose } from '../entities/clubVoteRecord.entity';

export class LaunchVoteDto {
  @IsNotEmpty()
  @IsNumber()
  clubId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  desc: string;
}

export class ChoiceVoteDto {
  @IsNotEmpty()
  @IsNumber()
  clubId: number;

  @IsNotEmpty()
  @IsNumber()
  voteId: number;

  @IsNotEmpty()
  @IsEnum(EChoose)
  choose: number;
}
