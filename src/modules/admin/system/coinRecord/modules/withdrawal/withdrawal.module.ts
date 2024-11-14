import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalController } from './withdrawal.controller';
import { WithdrawalRecord } from '../../entities/withdrawalRecord.entity';
import { UsersModule } from '../../../user/modules/user.module';
import { PhoneCoinService } from '../phoneCoin/phoneCoin.service';
import { PhoneCoin } from '../../entities/phoneCoin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WithdrawalRecord, PhoneCoin]),
    UsersModule,
  ],
  providers: [WithdrawalService, PhoneCoinService],
  controllers: [WithdrawalController],
})
export class WithdrawalModule {}
