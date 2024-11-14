import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneCoinService } from './phoneCoin.service';
import { PhoneCoinController } from './phoneCoin.controller';
import { UsersModule } from '../../../user/modules/user.module';
import { PhoneCoin } from '../../entities/phoneCoin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhoneCoin]), UsersModule],
  providers: [PhoneCoinService],
  controllers: [PhoneCoinController],
})
export class PhoneCoinModule {}
