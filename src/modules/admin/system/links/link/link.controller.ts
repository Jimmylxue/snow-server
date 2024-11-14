import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LinkService } from './link.service';
import {
  AddLinkDto,
  DelLinkDto,
  LinkListDto,
  UpdateLinkDto,
} from '../dto/link.dto';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  /**
   * 所有 链接 数据
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getList(@Body() body: LinkListDto) {
    const lists = await this.linkService.getLinkList(body);
    return {
      code: 200,
      result: lists,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async addLink(@Body() body: AddLinkDto) {
    await this.linkService.addLink(body);
    return {
      code: 200,
      result: '添加成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async updateLetter(@Body() body: UpdateLinkDto) {
    await this.linkService.updateLink(body);
    return {
      code: 200,
      result: '编辑成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delLetter(@Body() body: DelLinkDto) {
    await this.linkService.delLink(body);
    return {
      code: 200,
      result: '删除成功',
    };
  }
}
