import { Injectable } from '@nestjs/common';
import { ExpensesTypeService } from '@src/modules/bills/modules/expenses/expenseType/expenseType.service';
import { IncomeTypeService } from '@src/modules/bills/modules/incomes/incomeType/incomeType.service';

@Injectable()
export class RegisterEffectService {
  constructor(
    private readonly expenseTypeService: ExpensesTypeService,
    private readonly incomeTypeService: IncomeTypeService,
  ) {}

  /**
   * 注册回调
   */
  async registerEffectCallBack(userId: number) {
    await this.expenseTypeService.addSystemTypeToUserType(userId);
    await this.incomeTypeService.addSystemTypeToUserType(userId);
  }
}
