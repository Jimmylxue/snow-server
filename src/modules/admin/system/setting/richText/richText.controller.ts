import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RichTextService } from './richText.service';
import { RichTextListDto, UpdateRichTextDto } from '../dto/richText.dto';

@Controller('rich_text')
export class RichTextController {
  constructor(private readonly richTextService: RichTextService) {}

  /**
   * 所有 富文本数据
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getList(@Body() body: RichTextListDto) {
    const lists = await this.richTextService.getRichTextList(body);
    return {
      code: 200,
      result: lists,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async updateLetter(@Body() body: UpdateRichTextDto) {
    await this.richTextService.updateRichText(body);
    return {
      code: 200,
      result: '编辑成功',
    };
  }
}
