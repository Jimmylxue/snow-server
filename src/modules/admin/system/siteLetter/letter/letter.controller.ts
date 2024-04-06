import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LetterService } from './letter.service';
import {
  DelLetterDto,
  LetterListDto,
  UpdateLetterDto,
} from '../dto/letter.dto';
import { sendLetterDto } from '../dto/send.dto';
import { SendLetterService } from '../sendLetter/sendLetter.service';
import { EStatus } from '../entities/sendRecord.entity';

@Controller('message')
export class LetterController {
  constructor(
    private readonly letterService: LetterService,
    private readonly sendLetterService: SendLetterService,
  ) {}

  /**
   * 所有站内信信息
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getList(@Body() body: LetterListDto) {
    const letterList = await this.letterService.letterList(body);
    for (const [index, letter] of letterList.result.entries()) {
      const records = await this.sendLetterService.getRecordList({
        letterId: letter.letterId,
      });
      const hasReadCount = records.filter(
        (rec) => rec.status === EStatus.已读,
      ).length;
      const notReadCount = records.filter(
        (rec) => rec.status === EStatus.未读,
      ).length;
      // @ts-ignore
      letterList.result[index].hasReadCount = hasReadCount;
      // @ts-ignore
      letterList.result[index].notReadCount = notReadCount;
    }
    return {
      code: 200,
      result: letterList,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async addLetter(@Body() body: sendLetterDto) {
    const letter = await this.letterService.addLetter(body);
    return {
      code: 200,
      result: letter,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async updateLetter(@Body() body: UpdateLetterDto) {
    const letter = await this.letterService.updateLetter(body);
    if (letter) {
      return {
        code: 200,
        result: '更新成功',
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delLetter(@Body() body: DelLetterDto) {
    await this.letterService.delLetter(body);
    return {
      code: 200,
      result: '删除成功',
    };
  }
}
