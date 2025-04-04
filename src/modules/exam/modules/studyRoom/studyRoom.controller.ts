import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StudyRoomService } from './studyRoom.service';
import { JoinStudyRoomDto } from '../../dto/studyRoom.dto';

@Controller('studyRoom')
export class StudyRoomController {
  constructor(private readonly studyRoomService: StudyRoomService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/studyRoomList')
  async getTypeList() {
    const list = await this.studyRoomService.getRoomList();
    if (list) {
      return {
        code: 200,
        result: list,
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/joinStudyRoom')
  async joinStudyRoom(@Req() auth, @Body() body: JoinStudyRoomDto) {
    const { user } = auth;
    const userId = user.userId;
    return this.studyRoomService.joinStudyRoom(userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/exitStudyRoom')
  async exitStudyRoom(@Req() auth, @Body() body: JoinStudyRoomDto) {
    const { user } = auth;
    const userId = user.userId;
    return this.studyRoomService.exitStudyRoom(userId, body.studyRoomId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/studyRoomDetail')
  async studyRoomDetail(@Body() body: JoinStudyRoomDto) {
    return this.studyRoomService.studyRoomDetail(body.studyRoomId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/studyStatus')
  async studyStatus(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return this.studyRoomService.studyStatus(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/today')
  async todayStudyRecord(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return this.studyRoomService.todayStudyRecord(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/studyRecord')
  async studyRecord(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return this.studyRoomService.studyRecord(userId);
  }
}
