import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClubService } from './club.service';
import {
  AddClubDto,
  ClubListDto,
  SendNoticeDto,
  SignUpDto,
} from '../../dto/club.dto';

@Controller('club')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  /**
   * 获取所有的社团
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/allList')
  async getAllList(@Body() body: ClubListDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const records = await this.clubService.getAllList(body, userId);
    return {
      code: 200,
      result: records,
    };
  }

  /**
   * 获取用户参与的社团
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getList(@Body() body: ClubListDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const records = await this.clubService.getUserClub(body, userId);
    return {
      code: 200,
      result: records,
    };
  }

  /**
   * 学生报名社团
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/signUp')
  async signUpClub(@Body() body: SignUpDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return await this.clubService.signUpClub(body, userId);
  }

  /**
   * 管理员-添加社团
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async updateLetter(@Body() body: AddClubDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const letter = await this.clubService.addClub(body, userId);
    if (letter) {
      return {
        code: 200,
        result: '创建成功',
      };
    }
  }

  /**
   * 管理员-添加社团
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/sendNotice')
  async sendNotice(@Body() body: SendNoticeDto) {
    return await this.clubService.sendNotice(body);
  }
}
