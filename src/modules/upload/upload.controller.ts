import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
const upyun = require('upyun');

// @UseGuards(AuthGuard('jwt'))
@Controller('upload')
export class UploadController {
  constructor(private readonly configService: ConfigService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    const service = new upyun.Service(
      this.configService.get('UP_SERVICE_NAME'),
      this.configService.get('UP_OPERATOR_NAME'),
      this.configService.get('UP_PASSWORD'),
    );
    const client = new upyun.Client(service);
    const fileName = Date.now() + file.originalname;
    const res = await client.putFile('upload/' + fileName, file.buffer);
    if (res) {
      return {
        code: 200,
        message: '上传成功',
        result: `https://image.jimmyxuexue.top/upload/${fileName}`,
      };
    }
    return {
      code: 500,
      message: '上传失败',
    };
  }
}
