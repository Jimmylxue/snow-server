import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeTypeService } from './incomeType.service';
import { IncomeTypeController } from './incomeType.controller';
import { TBIncomeUserType } from '../../../entities/incomeUserType.entity';
import { TBIncomeSystemType } from '@src/modules/bills/entities/incomeSystemType.entity';
import { UsersModule } from '@src/modules/admin/system/user/modules/user.module';
@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([TBIncomeUserType, TBIncomeSystemType]),
  ],
  providers: [IncomeTypeService],
  controllers: [IncomeTypeController],
})
export class IncomeTypeModule {}
