import { Controller, Post, Body } from '@nestjs/common';
import { DoubaoService } from './doubao.service';
import { DoubaoProcessImageDto } from './doubao.dto';

@Controller('doubao')
export class DoubaoController {
  constructor(private readonly doubaoService: DoubaoService) {}

  @Post('process-image')
  async processImage(@Body() body: DoubaoProcessImageDto) {
    const res = await this.doubaoService.processImage(
      body.imageUrls,
      body.prompt,
    );
    if (res.code === 10000) {
      return {
        code: 200,
        result: res?.data?.image_urls,
      };
    }
    return {
      code: 500,
      message: res?.message,
    };
  }
}
