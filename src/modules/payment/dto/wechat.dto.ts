import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentDto {
  @IsNotEmpty()
  @IsString()
  openid: string;
}
