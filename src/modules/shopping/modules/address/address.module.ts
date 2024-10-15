import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Address } from '../../entities/address.entity';
// @ts-ignore
import { SystemConfig } from '../../entities/systemConfig.entity';
import { TempLink } from '../../entities/tempLink.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, SystemConfig, TempLink])],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
