import { Module } from '@nestjs/common';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { IncomesModule } from './modules/incomes/incomes.module';
import { BusinessModule } from './modules/business/business.module';
@Module({
  imports: [ExpensesModule, IncomesModule, BusinessModule],
})
export class BillsSystemModule {}

export enum BillsType {
  支出 = 1,
  收入,
}
