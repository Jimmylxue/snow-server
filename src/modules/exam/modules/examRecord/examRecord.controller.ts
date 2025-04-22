import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExamRecordService } from './examRecord.service';
import {
  CompleteExamDto,
  ExamPre100ScoreDto,
  ExamScoreRankDto,
  ProjectDetailDto,
} from '../../dto/examRecord.dto';

@Controller('examRecord')
export class ExamRecordController {
  constructor(private readonly examRecordService: ExamRecordService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/examProject')
  async examProject() {
    return this.examRecordService.examProject();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/projectDetail')
  async projectDetail(@Body() body: ProjectDetailDto) {
    return this.examRecordService.projectDetail(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/completeExam')
  async completeExam(@Req() auth, @Body() body: CompleteExamDto) {
    const { user } = auth;
    const userId = user.userId;
    return this.examRecordService.completeExam(userId, body);
  }

  /**
   * 获取考试 - 次数的排行榜 状态
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/examStatus')
  async examStatus(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return this.examRecordService.examStatus(userId);
  }

  /**
   * 获取考试成绩 的排行榜
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/examScoreRank')
  async examScoreRank(@Req() auth, @Body() body: ExamScoreRankDto) {
    const { user } = auth;
    const userId = user.userId;
    return this.examRecordService.examScoreRank(userId, body);
  }

  /**
   * 获取前100名学生的成绩
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/examPre100Score')
  async examPre100Score(@Req() auth, @Body() body: ExamPre100ScoreDto) {
    const { user } = auth;
    const userId = user.userId;
    return this.examRecordService.examPre100Score(userId, body);
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
