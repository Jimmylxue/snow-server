import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExamRecordService } from './examRecord.service';
import { CompleteExamDto } from '../../dto/examRecord.dto';

@Controller('examRecord')
export class ExamRecordController {
  constructor(private readonly examRecordService: ExamRecordService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/completeExam')
  async completeExam(@Req() auth, @Body() body: CompleteExamDto) {
    const { user } = auth;
    const userId = user.userId;
    return this.examRecordService.completeExam(userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/examStatus')
  async examStatus(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return this.examRecordService.examStatus(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/today')
  async examRecordList(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return this.examRecordService.todayExamRecord(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/record')
  async examRecord(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return this.examRecordService.examRecord(userId);
  }
}
