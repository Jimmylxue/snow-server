import { Module } from '@nestjs/common';
import { WithdrawalModule } from './modules/withdrawal/withdrawal.module';

@Module({
  imports: [WithdrawalModule],
  providers: [],
  controllers: [],
})
export class CoinModule {}
