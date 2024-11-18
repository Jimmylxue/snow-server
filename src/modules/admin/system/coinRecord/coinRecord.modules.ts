import { Module } from '@nestjs/common';
import { WithdrawalModule } from './modules/withdrawal/withdrawal.module';
import { PhoneCoinModule } from './modules/phoneCoin/phoneCoin.module';
import { GainCoinModule } from './modules/gainCoin/gainCoin.module';

@Module({
  imports: [WithdrawalModule, PhoneCoinModule, GainCoinModule],
  providers: [],
  controllers: [],
})
export class CoinModule {}
