import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesTypeService } from './expenseType.service';
import { ExpensesTypeController } from './expenseType.controller';
import { TBExpenseUserType } from '../../../entities/expenseUserType.entity';
import { TBExpenseSystemType } from '@src/modules/bills/entities/expenseSystemType.entity';
@Module({
  imports: [TypeOrmModule.forFeature([TBExpenseUserType, TBExpenseSystemType])],
  providers: [ExpensesTypeService],
  controllers: [ExpensesTypeController],
})
export class ExpensesTypeModule {}
