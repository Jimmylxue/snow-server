import { Module } from '@nestjs/common';
import { ExpensesTypeModule } from './expenseType/expenseType.module';
import { ExpenseModule } from './expense/expense.module';
@Module({
  imports: [ExpenseModule, ExpensesTypeModule],
})
export class ExpensesModule {}
