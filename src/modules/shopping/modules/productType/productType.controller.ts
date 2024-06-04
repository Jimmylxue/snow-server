import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductTypeService } from './productType.service';
import {
  AddProductTypeDto,
  DelProductTypeDto,
  EditProductTypeDto,
  ProductTypeListDto,
} from '../../dto/productType.dto';

@Controller('productType')
export class ProductTypeController {
  constructor(private readonly productTypeService: ProductTypeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async signIn(@Body() body: AddProductTypeDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const records = await this.productTypeService.add(body, userId);
    return {
      code: 200,
      result: records,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getSignList(@Body() body: ProductTypeListDto, @Req() auth) {
    const list = await this.productTypeService.getAllList(body);
    if (list) {
      return {
        code: 200,
        result: list,
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/edit')
  async editProduct(@Body() body: EditProductTypeDto) {
    const letter = await this.productTypeService.edit(body);
    if (letter) {
      return {
        code: 200,
        result: '操作成功',
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delProduct(@Body() body: DelProductTypeDto) {
    const res = await this.productTypeService.del(body);
    if (res.affected === 0) {
      return {
        code: 500,
        result: '检查删除内容是否存在',
      };
    }
    return {
      code: 200,
      result: '删除成功',
    };
  }
}
