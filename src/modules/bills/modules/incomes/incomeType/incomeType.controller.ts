import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { IncomeTypeService } from './incomeType.service';
import { AuthGuard } from '@nestjs/passport';
import {
  IncomeTypeAddDTO,
  IncomeTypeDelDTO,
  IncomeTypeDetailDTO,
  IncomeTypeListDTO,
  IncomeTypeUpdateDTO,
} from '../dto/incomeType.dto';

@Controller('bill_system/income_type')
export class IncomeTypeController {
  constructor(private readonly incomeTypeService: IncomeTypeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getUserType(@Body() req: IncomeTypeListDTO, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const list = await this.incomeTypeService.getList(req, userId);
    return {
      code: 200,
      result: list,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/detail')
  async getTypeDetail(@Body() req: IncomeTypeDetailDTO) {
    const { id } = req;
    const incomeType = await this.incomeTypeService.getDetail(id);
    if (!incomeType) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    return {
      code: 200,
      result: incomeType,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async addUserType(@Body() req: IncomeTypeAddDTO, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    await this.incomeTypeService.add(req, userId);
    return {
      code: 200,
      result: '添加成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delType(@Body() req: IncomeTypeDelDTO) {
    await this.incomeTypeService.del(req.id);
    return {
      code: 200,
      message: '删除成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async updateTask(@Body() req: IncomeTypeUpdateDTO) {
    await this.incomeTypeService.updateType(req);
    return {
      code: 200,
      result: '更新成功',
    };
  }
}
