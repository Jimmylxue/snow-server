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
      body.returnUrl,
    );
    if (res.code === 10000) {
      return {
        code: 200,
        result: body.returnUrl
          ? res?.data?.image_urls
          : res?.data?.binary_data_base64,
      };
    }
    console.log('dddd', res);
    return {
      code: 500,
      message: res?.message,
    };
  }
}
