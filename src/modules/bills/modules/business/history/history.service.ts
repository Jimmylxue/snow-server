import { Injectable } from '@nestjs/common';
import { IncomeService } from '../../incomes/income/income.service';
import { ExpenseService } from '../../expenses/expense/expense.service';
import { MonthRecordDTO } from '../dto/history.dto';
import { TBExpense } from '@src/modules/bills/entities/expense.entity';
import { TBIncome } from '@src/modules/bills/entities/income.entity';
var dayjs = require('dayjs');

@Injectable()
export class HistoryService {
  constructor(
    private readonly incomeService: IncomeService,
    private readonly expenseService: ExpenseService,
  ) {}

  async getMonthRecord(req: MonthRecordDTO, userId: number) {
    const { startTime, endTime } = req;
    const incomes = await this.incomeService.getList(
      { startTime, endTime, pageSize: 1000, page: 1 },
      userId,
    );
    const incomeList = incomes.result;
    const expenses = await this.expenseService.getList(
      { startTime, endTime, pageSize: 1000, page: 1 },
      userId,
    );
    const expenseList = expenses.result;
    /**
     * 总收入
     */
    const totalIncome = +incomeList
      .reduce((acc, curr) => acc + curr.price, 0)
      .toFixed(2);
    /**
     * 总支出
     */
    const totalExpense = +expenseList
      .reduce((acc, curr) => acc + curr.price, 0)
      .toFixed(2);

    /**
     * 日均支出
     */
    const dailyExpensePrice = +(totalExpense / new Date().getDate()).toFixed(2);

    /**
     * 月结余
     */
    const monthBalance = +(totalIncome - totalExpense).toFixed(2);

    const dailyDetailMap: {
      [key in string]: {
        list: (TBExpense | TBIncome)[];
        income: number;
        expense: number;
        balance: number;
      };
    } = {};
    incomeList.forEach((item) => {
      const date = dayjs(item.use_time).format('YYYY-MM-DD');
      if (!dailyDetailMap[date]) {
        dailyDetailMap[date] = {
          list: [],
          income: 0,
          expense: 0,
          balance: 0,
        };
        dailyDetailMap[date].list.push(item);
        dailyDetailMap[date].income += item.price;
        dailyDetailMap[date].balance += item.price;
      } else {
        dailyDetailMap[date].list.push(item);
        dailyDetailMap[date].income += item.price;
        dailyDetailMap[date].balance += item.price;
      }
    });

    expenseList.forEach((item) => {
      const date = dayjs(item.use_time).format('YYYY-MM-DD');
      if (!dailyDetailMap[date]) {
        dailyDetailMap[date] = {
          list: [],
          income: 0,
          expense: 0,
          balance: 0,
        };
        dailyDetailMap[date].list.push(item);
        dailyDetailMap[date].expense += item.price;
        dailyDetailMap[date].balance -= item.price;
      } else {
        dailyDetailMap[date].list.push(item);
        dailyDetailMap[date].expense += item.price;
        dailyDetailMap[date].balance -= item.price;
      }
    });

    return {
      totalIncome,
      totalExpense,
      dailyExpensePrice,
      monthBalance,
      incomeList,
      expenseList,
      dailyDetailMap,
    };
  }
}
