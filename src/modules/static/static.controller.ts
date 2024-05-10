import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StaticService } from './static.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { hasDir, mkADir, writeAFile } from '@src/utils/file';
import { resolve } from 'path';
import { ConfigService } from '@nestjs/config';

@Controller('static')
export class StaticController {
  constructor(
    private readonly staticService: StaticService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 上传是上传到 dist 下的文件夹
   */
  @Post('/uploadfile')
  @UseInterceptors(FileInterceptor('file'))
  async getBaseInfos(@UploadedFile() file, @Body() stream) {
    const originPath = resolve(process.cwd(), 'public');
    const baseUrl = this.configService.get('STATIC_BASE_URL');

    const hasOriginDir = await hasDir(originPath);
    if (!hasOriginDir) {
      console.log('目录不存在，手动创建目录');
      await mkADir(originPath);
    }

    const fileName = Date.now() + file.originalname;

    const writeRes = writeAFile(file, `${originPath}/${fileName}`);
    if (writeRes) {
      return {
        code: 200,
        message: '文件写入成功',
        result: `${baseUrl}/${fileName}`,
      };
    }
    return { code: 500, message: '文件写入失败' };
  }
}
