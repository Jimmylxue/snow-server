import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TBIncome } from '../../../entities/income.entity';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
@Module({
  imports: [TypeOrmModule.forFeature([TBIncome])],
  providers: [IncomeService],
  controllers: [IncomeController],
})
export class IncomeModule {}
