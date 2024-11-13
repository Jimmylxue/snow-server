import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalController } from './withdrawal.controller';
import { WithdrawalRecord } from '../../entities/withdrawalRecord.entity';
import { UsersModule } from '../../../user/modules/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([WithdrawalRecord]), UsersModule],
  providers: [WithdrawalService],
  controllers: [WithdrawalController],
})
export class WithdrawalModule {}
