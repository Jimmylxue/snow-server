import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetCommitDto } from '@src/modules/admin/system/resource/controllers/github/github.dto';
import { SystemException } from '@src/exception';
import { WordService } from './word.service';
import { DelWordBody, ListWordBody, SaveWordBody } from '../dto/word.dto';

@Controller('words')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async wordList(@Body() req: ListWordBody, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const { result, total } = await this.wordService.getUserWords({
      ...req,
      userId,
    });
    return {
      code: 200,
      message: '请求成功',
      result: {
        page: req.page,
        result,
        total,
      },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/save')
  async saveWords(@Body() req: SaveWordBody, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const { status, message } = await this.wordService.saveWords({
      ...req,
      userId,
    });
    if (status === 1) {
      return { code: 200, message };
    } else {
      return { code: 500, message };
    }
  }

  @Post('/del')
  async delWords(@Body() req: DelWordBody) {
    const { status, message } = await this.wordService.delWords(req);
    if (status === 1) {
      return { code: 200, result: message };
    }
  }
}
