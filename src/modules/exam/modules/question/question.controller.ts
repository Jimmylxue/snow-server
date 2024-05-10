import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QuestionService } from './question.service';
import {
  AddQuestionDto,
  AddQuestionTypeDto,
  DelQuestionDto,
  DelQuestionTypeDto,
  RandomQuestionDto,
} from '../../dto/question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  /**
   * 管理员-添加题目类型
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/addType')
  async addQuestionType(@Body() body: AddQuestionTypeDto) {
    const letter = await this.questionService.addQuestionType(body);
    if (letter) {
      return {
        code: 200,
        result: '创建成功',
      };
    }
  }

  /**
   * 管理员-删除题目类型
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/delType')
  async deleteQuestionType(@Body() body: DelQuestionTypeDto) {
    const res = await this.questionService.delQuestionType(body);
    if (res.affected === 0) {
      return {
        code: 500,
        result: '检查删除内容是否存在',
      };
    }
    return {
      code: 200,
      result: '删除成功',
    };
  }

  /**
   * 管理员-添加题目题目
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/addQuestion')
  async addQuestion(@Body() body: AddQuestionDto) {
    const question = await this.questionService.addQuestion(body);
    if (question) {
      return {
        code: 200,
        result: '创建成功',
      };
    }
  }

  /**
   * 管理员-添加题目题目
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/delQuestion')
  async delQuestion(@Body() body: DelQuestionDto) {
    const res = await this.questionService.delQuestion(body);
    if (res.affected === 0) {
      return {
        code: 500,
        result: '检查删除内容是否存在',
      };
    }
    return {
      code: 200,
      result: '删除成功',
    };
  }

  /**
   * 随机获取 题目
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/randomQuestion')
  async getRandomQuestion(@Body() body: RandomQuestionDto) {
    const questionList = await this.questionService.getRandomQuestion(body);
    if (questionList) {
      return {
        code: 200,
        result: questionList,
      };
    }
  }
}
