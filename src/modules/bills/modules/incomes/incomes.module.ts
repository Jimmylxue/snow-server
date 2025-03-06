import { Module } from '@nestjs/common';
import { IncomeTypeModule } from './incomeType/incomeType.module';
import { IncomeModule } from './income/income.module';
@Module({
  imports: [IncomeModule, IncomeTypeModule],
})
export class IncomesModule {}
