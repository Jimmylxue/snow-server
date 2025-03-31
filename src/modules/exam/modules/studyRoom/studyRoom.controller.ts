import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StudyRoomService } from './studyRoom.service';
import {
  AddQuestionDto,
  AddQuestionTypeDto,
  DelQuestionDto,
  DelQuestionTypeDto,
  EditQuestionDto,
  EditQuestionTypeDto,
  QuestionListDto,
  QuestionTypeListDto,
  RandomQuestionDto,
} from '../../dto/question.dto';

@Controller('studyRoom')
export class StudyRoomController {
  constructor(private readonly studyRoomService: StudyRoomService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/listType')
  async getTypeList(@Body() body: QuestionTypeListDto) {
    const list = await this.studyRoomService.getAllList(body);
    if (list) {
      return {
        code: 200,
        result: list,
      };
    }
  }

  /**
   * 管理员-添加题目类型
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/addType')
  async addQuestionType(@Body() body: AddQuestionTypeDto) {
    const letter = await this.studyRoomService.addQuestionType(body);
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
    const res = await this.studyRoomService.delQuestionType(body);
    // @ts-ignore
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

  @UseGuards(AuthGuard('jwt'))
  @Post('/editType')
  async editQuestionType(@Body() body: EditQuestionTypeDto) {
    const letter = await this.studyRoomService.editQuestionType(body);
    if (letter) {
      return {
        code: 200,
        result: '创建成功',
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/listQuestion')
  async getQuestionList(@Body() body: QuestionListDto) {
    const list = await this.studyRoomService.getAllQuestionList(body);
    if (list) {
      return {
        code: 200,
        result: list,
      };
    }
  }

  /**
   * 管理员-添加题目题目
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/addQuestion')
  async addQuestion(@Body() body: AddQuestionDto) {
    const question = await this.studyRoomService.addQuestion(body);
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
    const res = await this.studyRoomService.delQuestion(body);
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

  @UseGuards(AuthGuard('jwt'))
  @Post('/editQuestion')
  async editCourse(@Body() body: EditQuestionDto) {
    const letter = await this.studyRoomService.editQuestion(body);
    if (letter) {
      return {
        code: 200,
        result: '创建成功',
      };
    }
  }

  /**
   * 随机获取 题目
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/randomQuestion')
  async getRandomQuestion(@Body() body: RandomQuestionDto) {
    const questionList = await this.studyRoomService.getRandomQuestion(body);
    if (questionList) {
      return {
        code: 200,
        result: questionList,
      };
    }
  }
}
