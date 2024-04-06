import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoggerService } from '@src/modules/shared/service/Logger.service';
import { hasDir, mkADir, writeAFile } from '@src/utils/file';
import { StackParser } from '@src/utils/stackParser';
import { join } from 'path';
@Controller('catch')
export class CatchErrorController {
  constructor(@Inject(LoggerService) private readonly logger: LoggerService) {}

  @Get('/upload')
  async getUploadInfo(@Query() query) {
    let json = JSON.parse(Buffer.from(query.info, 'base64').toString('utf-8'));
    const stackParser = new StackParser(join(__dirname, './source'));
    const stackFrame = stackParser.parseStackTrack(json.stack, json.message);
    const originStack = await stackParser.getOriginalErrorStack(stackFrame);
    const error = new Error();
    error.message = json.message;
    error.stack = originStack as any;
    this.logger.clientError(error);
    return '解析成功';
  }

  /**
   * 上传是上传到 dist 下的文件夹
   */
  @Post('/uploadfile')
  @UseInterceptors(FileInterceptor('file'))
  async getBaseInfos(@UploadedFile() file, @Body() stream) {
    const originPath = `${__dirname}/source`;
    const hasOriginDir = await hasDir(originPath);
    if (!hasOriginDir) {
      console.log('目录不存在，手动创建目录');
      await mkADir(originPath);
    }

    const writeRes = writeAFile(file, `${originPath}/${file.originalname}`);
    if (writeRes) {
      return { code: 200, message: '文件写入成功' };
    }
    return { code: 500, message: '文件写入失败' };
  }
}
