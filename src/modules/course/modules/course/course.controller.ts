import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CourseService } from './course.service';
import {
  AddCourseTypeDto,
  DelCourseTypeDto,
  AddCourseDto,
  DelCourseDto,
  RandomCourseDto,
  CourseTypeListDto,
  CourseListDto,
  EditCourseTypeDto,
  EditCourseDto,
} from '../../dto/course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  /**
   * 管理员-添加题目类型
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/listType')
  async getTypeList(@Body() body: CourseTypeListDto) {
    const list = await this.courseService.getAllList(body);
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
  async addCourseType(@Body() body: AddCourseTypeDto) {
    const letter = await this.courseService.addCourseType(body);
    if (letter) {
      return {
        code: 200,
        result: '创建成功',
      };
    }
  }

  /**
   * 管理员-添加题目类型
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/editType')
  async editCourseType(@Body() body: EditCourseTypeDto) {
    const letter = await this.courseService.editCourseType(body);
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
  async delCourseType(@Body() body: DelCourseTypeDto) {
    const res = await this.courseService.delCourseType(body);
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
  @Post('/listCourse')
  async getCourseList(@Body() body: CourseListDto) {
    const list = await this.courseService.getAllCourseList(body);
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
  @Post('/addCourse')
  async addCourse(@Body() body: AddCourseDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const question = await this.courseService.addCourse(body, userId);
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
  @Post('/delCourse')
  async delCourse(@Body() body: DelCourseDto) {
    const res = await this.courseService.delCourse(body);
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
   * 管理员-添加题目类型
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/editCourse')
  async editCourse(@Body() body: EditCourseDto) {
    const letter = await this.courseService.editCourse(body);
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
  @Post('/randomCourse')
  async getRandomCourse(@Body() body: RandomCourseDto) {
    const questionList = await this.courseService.getRandomCourse(body);
    if (questionList) {
      return {
        code: 200,
        result: questionList,
      };
    }
  }
}