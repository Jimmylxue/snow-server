import { IsNotEmpty, IsString } from 'class-validator';

export class TUserInfoParamsDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
