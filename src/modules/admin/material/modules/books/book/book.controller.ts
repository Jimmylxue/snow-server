import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookService } from './book.service';
import {
  BookListDTO,
  BookDetailDTO,
  BookAddDTO,
  BookDelDTO,
  BookUpdateDTO,
} from '../dto/book.dto';
@Controller('material/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getUserType(@Body() req: BookListDTO) {
    const list = await this.bookService.getList(req);
    return {
      code: 200,
      result: list,
    };
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('/detail')
  async getTypeDetail(@Body() req: BookDetailDTO) {
    const { id } = req;
    const book = await this.bookService.getDetail(id);
    if (!book) {
      return {
        code: 500,
        message: '参数错误-请检查参数是否一致',
      };
    }
    return {
      code: 200,
      result: book,
    };
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async addUserType(@Body() req: BookAddDTO) {
    await this.bookService.add(req);
    return {
      code: 200,
      result: '添加成功',
    };
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delType(@Body() req: BookDelDTO) {
    await this.bookService.del(req.id);
    return {
      code: 200,
      message: '删除成功',
    };
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async updateTask(@Body() req: BookUpdateDTO) {
    await this.bookService.update(req);
    return {
      code: 200,
      result: '更新成功',
    };
  }
}
