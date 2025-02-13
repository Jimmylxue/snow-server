import { Controller, Post, Body } from '@nestjs/common';
import { DoubaoService } from './doubao.service';
import { DoubaoProcessImageDto } from './doubao.dto';

@Controller('doubao')
export class DoubaoController {
  constructor(private readonly doubaoService: DoubaoService) {}

  @Post('process-image')
  async processImage(@Body() body: DoubaoProcessImageDto) {
    return await this.doubaoService.processImage(body.imageUrls, body.prompt);
  }
}
