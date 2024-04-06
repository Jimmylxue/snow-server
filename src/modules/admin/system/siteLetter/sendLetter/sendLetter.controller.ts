import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SendLetterService } from './sendLetter.service';
import { AuthGuard } from '@nestjs/passport';
import {
  recordListDto,
  recordUserDto,
  sendLetterDto,
  sendSomeDto,
  userReadDto,
  userRecordDto,
} from '../dto/send.dto';
import { LetterService } from '../letter/letter.service';

@Controller('letter')
export class SendLetterController {
  constructor(
    private readonly sendLetterService: SendLetterService,
    private readonly letterService: LetterService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/send')
  async sendLetter(@Body() body: sendLetterDto) {
    const letter = await this.letterService.addLetter(body);
    const record = await this.sendLetterService.sendLetter(letter.letterId);
    if (record.recordId) {
      return {
        code: 200,
        result: '发送成功',
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/sendSome')
  async sendSome(@Body() body: sendSomeDto) {
    const records = await this.sendLetterService.sendToSome(
      body.letterId,
      body.userIds,
    );
    if (records) {
      return {
        code: 200,
        result: records.raw.affectedRows + '条数据操作成功',
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/record')
  async recordList(@Body() body: recordListDto) {
    return this.sendLetterService.getRecordList(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/record/user')
  async recordUser(@Body() body: recordUserDto) {
    const records = await this.sendLetterService.getRecordUser(body);
    return {
      code: 200,
      result: records,
    };
  }

  /**
   * 获取用户的 消息列表
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/user/record')
  async userRecord(@Body() body: userRecordDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const records = await this.sendLetterService.getUserLetter(body, userId);
    return {
      code: 200,
      result: records.filter((item) => item.letter.platform === body.platform),
    };
  }

  /**
   * 手动更新 阅读状态
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/user/read')
  async userRead(@Body() body: userReadDto, @Req() auth) {
    await this.sendLetterService.updateRecord(body);
    return {
      code: 200,
      result: '操作成功',
    };
  }
}
