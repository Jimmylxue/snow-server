import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './product.service';
import {
  AddProductDto,
  DelProductDto,
  EditProductDto,
  ProductListDto,
} from '../../dto/product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 添加商品
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async signIn(@Body() body: AddProductDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const records = await this.productService.addProduct(body, userId);
    return {
      code: 200,
      result: records,
    };
  }

  /**
   * 查看商品列表
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getSignList(@Body() body: ProductListDto, @Req() auth) {
    const list = await this.productService.getAllList(body);
    if (list) {
      return {
        code: 200,
        result: list,
      };
    }
  }

  /**
   * 管理员-添加题目类型
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/edit')
  async editProduct(@Body() body: EditProductDto) {
    const letter = await this.productService.editProduct(body);
    if (letter) {
      return {
        code: 200,
        result: '操作成功',
      };
    }
  }

  /**
   * 管理员-添加题目类型
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delProduct(@Body() body: DelProductDto) {
    const res = await this.productService.delProduct(body);
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
