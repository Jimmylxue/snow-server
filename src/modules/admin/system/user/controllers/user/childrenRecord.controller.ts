import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { AddRecordDto, RemoveRecordDto } from '../../dto/childrenRecord.dto';
import { ChildrenRecordService } from '../../services/childrenRecord.service';

@Controller('childrenRecord')
export class ChildrenRecordController {
  constructor(private readonly childrenRecordService: ChildrenRecordService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async addRecord(@Body() body: AddRecordDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return await this.childrenRecordService.addRecord(body, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('remove')
  async removeRecord(@Body() body: RemoveRecordDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return await this.childrenRecordService.removeRecord(body, userId);
  }

  /**
   * 查看这个用户的儿子
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async getList(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const list = await this.childrenRecordService.getAllList(userId);
    return {
      code: 200,
      result: list,
    };
  }

  /**
   * 查看这个用户的家长
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('getParent')
  async getParent(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return await this.childrenRecordService.getParent(userId);
  }
}
