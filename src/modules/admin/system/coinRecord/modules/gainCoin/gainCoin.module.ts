import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GainCoinService } from './gainCoin.service';
import { GainCoinController } from './gainCoin.controller';
import { UsersModule } from '../../../user/modules/user.module';
import { PhoneCoinService } from '../phoneCoin/phoneCoin.service';
import { PhoneCoin } from '../../entities/phoneCoin.entity';
import { GainCoinRecord } from '../../entities/gainCoinRecord.entity';
import { LinkService } from '../../../links/link/link.service';
import { Link } from '../../../links/entities/links.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GainCoinRecord, PhoneCoin, Link]),
    UsersModule,
  ],
  providers: [GainCoinService, PhoneCoinService, LinkService],
  controllers: [GainCoinController],
})
export class GainCoinModule {}
