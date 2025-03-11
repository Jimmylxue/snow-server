import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { ExpenseModule } from '../../expenses/expense/expense.module';
import { IncomeModule } from '../../incomes/income/income.module';
@Module({
  imports: [IncomeModule, ExpenseModule],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
