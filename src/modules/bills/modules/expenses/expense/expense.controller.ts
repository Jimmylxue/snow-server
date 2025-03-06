import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpenseService } from './expense.service';
import {
  ExpenseListDTO,
  ExpenseDetailDTO,
  ExpenseAddDTO,
  ExpenseDelDTO,
  ExpenseUpdateDTO,
} from '../dto/expense.dto';
@Controller('bill_system/expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getUserType(@Body() req: ExpenseListDTO, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const list = await this.expenseService.getList(req, userId);
    return {
      code: 200,
      result: list,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/detail')
  async getTypeDetail(@Body() req: ExpenseDetailDTO) {
    const { id } = req;
    const expense = await this.expenseService.getDetail(id);
    if (!expense) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    return {
      code: 200,
      result: expense,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async addUserType(@Body() req: ExpenseAddDTO, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    await this.expenseService.add(req, userId);
    return {
      code: 200,
      result: '添加成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delType(@Body() req: ExpenseDelDTO) {
    await this.expenseService.del(req.id);
    return {
      code: 200,
      message: '删除成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async updateTask(@Body() req: ExpenseUpdateDTO) {
    await this.expenseService.update(req);
    return {
      code: 200,
      result: '更新成功',
    };
  }
}
