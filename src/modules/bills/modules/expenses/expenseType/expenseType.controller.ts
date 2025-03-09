import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ExpensesTypeService } from './expenseType.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ExpenseTypeAddDTO,
  ExpenseTypeDelDTO,
  ExpenseTypeDetailDTO,
  ExpenseTypeListDTO,
  ExpenseTypeUpdateDTO,
} from '../dto/expenseType.dto';
import { UserService } from '@src/modules/admin/system/user/services/user.service';
@Controller('bill_system/expense_type')
export class ExpensesTypeController {
  constructor(
    private readonly expenseTypeService: ExpensesTypeService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getUserType(@Body() req: ExpenseTypeListDTO, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const list = await this.expenseTypeService.getList(req, userId);
    return {
      code: 200,
      result: list,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/detail')
  async getTypeDetail(@Body() req: ExpenseTypeDetailDTO) {
    const { id } = req;
    const expenseType = await this.expenseTypeService.getDetail(id);
    if (!expenseType) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    return {
      code: 200,
      result: expenseType,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async addUserType(@Body() req: ExpenseTypeAddDTO, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    await this.expenseTypeService.add(req, userId);
    return {
      code: 200,
      result: '添加成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delType(@Body() req: ExpenseTypeDelDTO) {
    await this.expenseTypeService.del(req.id);
    return {
      code: 200,
      message: '删除成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async updateTask(@Body() req: ExpenseTypeUpdateDTO) {
    await this.expenseTypeService.updateType(req);
    return {
      code: 200,
      result: '更新成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/add_system_type_to_all_user')
  async addSystemTypeToUserType() {
    const userIdList = await this.userService.findAllId();
    for (const userId of userIdList) {
      await this.expenseTypeService.addSystemTypeToUserType(userId);
    }
    return {
      code: 200,
      result: '更新成功',
    };
  }
}
