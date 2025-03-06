import { Module } from '@nestjs/common';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { IncomesModule } from './modules/incomes/incomes.module';
@Module({
  imports: [ExpensesModule, IncomesModule],
})
export class BillsSystemModule {}
