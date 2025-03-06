import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TBExpense } from '../../../entities/expense.entity';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
@Module({
  imports: [TypeOrmModule.forFeature([TBExpense])],
  providers: [ExpenseService],
  controllers: [ExpenseController],
})
export class ExpenseModule {}
