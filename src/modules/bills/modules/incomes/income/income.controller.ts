import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomeService } from './income.service';
import {
  IncomeListDTO,
  IncomeDetailDTO,
  IncomeAddDTO,
  IncomeDelDTO,
  IncomeUpdateDTO,
} from '../dto/income.dto';
@Controller('bill_system/income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getUserType(@Body() req: IncomeListDTO) {
    const list = await this.incomeService.getList(req);
    return {
      code: 200,
      result: list,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/detail')
  async getTypeDetail(@Body() req: IncomeDetailDTO) {
    const { id } = req;
    const income = await this.incomeService.getDetail(id);
    if (!income) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    return {
      code: 200,
      result: income,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async addUserType(@Body() req: IncomeAddDTO, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    await this.incomeService.add(req, userId);
    return {
      code: 200,
      result: '添加成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delType(@Body() req: IncomeDelDTO) {
    await this.incomeService.del(req.id);
    return {
      code: 200,
      message: '删除成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async updateTask(@Body() req: IncomeUpdateDTO) {
    await this.incomeService.update(req);
    return {
      code: 200,
      result: '更新成功',
    };
  }
}
