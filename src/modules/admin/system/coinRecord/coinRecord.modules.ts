import { Module } from '@nestjs/common';
import { WithdrawalModule } from './modules/withdrawal/withdrawal.module';
import { PhoneCoinModule } from './modules/phoneCoin/phoneCoin.module';

@Module({
  imports: [WithdrawalModule, PhoneCoinModule],
  providers: [],
  controllers: [],
})
export class CoinModule {}
