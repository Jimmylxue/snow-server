import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BookTypeService } from './bookType.service';
import { AuthGuard } from '@nestjs/passport';
import {
  BookTypeAddDTO,
  BookTypeDelDTO,
  BookTypeDetailDTO,
  BookTypeUpdateDTO,
  BookTypeListDTO,
} from '../dto/bookType.dto';
@Controller('material/bookType')
export class BookTypeController {
  constructor(private readonly bookTypeService: BookTypeService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getUserType(@Body() req: BookTypeListDTO) {
    const list = await this.bookTypeService.getList(req);
    return {
      code: 200,
      result: list,
    };
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('/detail')
  async getTypeDetail(@Body() req: BookTypeDetailDTO) {
    const { id } = req;
    const bookType = await this.bookTypeService.getDetail(id);
    if (!bookType) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    return {
      code: 200,
      result: bookType,
    };
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async addUserType(@Body() req: BookTypeAddDTO) {
    await this.bookTypeService.add(req);
    return {
      code: 200,
      result: '添加成功',
    };
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delType(@Body() req: BookTypeDelDTO) {
    await this.bookTypeService.del(req.id);
    return {
      code: 200,
      message: '删除成功',
    };
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async updateTask(@Body() req: BookTypeUpdateDTO) {
    await this.bookTypeService.updateType(req);
    return {
      code: 200,
      result: '更新成功',
    };
  }
}
