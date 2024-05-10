import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SystemException } from '@src/exception';
import { TranslateService } from '../../services/baiduFanYi/baiduFanYi.service';
import {
  CheckLanguageDto,
  FanYiDto,
  PictureTranslateDto,
} from './dto/baiduFanYi.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('translate')
export class TranslateController {
  constructor(private readonly fanYiService: TranslateService) {}

  @Post('/base')
  async getAllUser(@Body() req: FanYiDto) {
    const {
      data: { error_code, error_msg, from, to, trans_result },
    } = await this.fanYiService.translate(req);
    if (error_code) {
      throw new SystemException('THIRD_PART_SERVICE_ERROR_CODE', 200, {
        error_code,
        error_msg,
      });
    }

    return {
      code: 200,
      result: {
        from,
        to,
        trans_result,
      },
    };
  }

  /**
   * 检查语种
   */
  @Post('/check_language')
  async checkLanguage(@Body() req: CheckLanguageDto) {
    const { q } = req;
    const { error_code, error_msg, data } =
      await this.fanYiService.checkLanguage(q);
    if (error_code) {
      throw new SystemException('THIRD_PART_SERVICE_ERROR_CODE', 200, {
        error_code,
        error_msg,
      });
    }
    return {
      code: 200,
      result: data,
    };
  }

  @Post('/picture_translate')
  @UseInterceptors(FileInterceptor('file'))
  async pictureTranslate(
    @UploadedFile() file,
    @Body() req: PictureTranslateDto,
  ) {
    const { error_code, error_msg, data } =
      await this.fanYiService.pictureTranslate(req, file.buffer);
    if (+error_code) {
      throw new SystemException('THIRD_PART_SERVICE_ERROR_CODE', 200, {
        error_code,
        error_msg,
      });
    }

    return {
      code: 200,
      result: data,
    };
  }
}
