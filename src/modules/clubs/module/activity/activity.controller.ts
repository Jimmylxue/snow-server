import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClubActivityService } from './activity.service';
import {
  AddClubActivityDto,
  ClubActivityListDto,
  FeedBackDto,
  SignInDto,
  SignUpActivityDto,
} from '../../dto/clubActivity.dto';

@Controller('cactivity')
export class ClubActivityController {
  constructor(private readonly clubActivityService: ClubActivityService) {}

  /**
   * 查看活动记录
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getList(@Body() body: ClubActivityListDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const records = await this.clubActivityService.getUserClubActivity(
      body,
      userId,
    );
    return {
      code: 200,
      result: records,
    };
  }

  /**
   * 学生报名社团活动
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/signUp')
  async signUpClubActivity(@Body() body: SignUpActivityDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return await this.clubActivityService.signUpClubActivity(body, userId);
  }

  /**
   * 管理员-添加社团
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async updateLetter(@Body() body: AddClubActivityDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const letter = await this.clubActivityService.addClubActivity(body, userId);
    if (letter) {
      return {
        code: 200,
        result: '创建成功',
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/feedback')
  async feedback(@Body() body: FeedBackDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const letter = await this.clubActivityService.feedback(body, userId);
    if (letter) {
      return {
        code: 200,
        result: '创建成功',
      };
    }
  }

  /**
   * 活动签到
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/signIn')
  async signIn(@Body() body: SignInDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return await this.clubActivityService.signIn(body, userId);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('/updateStatus')
  // async updateStatus(@Body() body: UpdateHabitStatusDto) {
  //   const letter = await this.habitService.updateLetter(body);
  //   if (letter) {
  //     return {
  //       code: 200,
  //       result: '更新成功',
  //     };
  //   }
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('/del')
  // async delLetter(@Body() body: DelHabitDto) {
  //   const res = await this.habitService.delLetter(body);
  //   if (res.affected === 0) {
  //     return {
  //       code: 500,
  //       result: '检查删除内容是否存在',
  //     };
  //   }
  //   return {
  //     code: 200,
  //     result: '删除成功',
  //   };
  // }
}
