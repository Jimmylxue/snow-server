import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LinkPlatformService } from './linkPlatform.service';
import {
  AddLinkTypeDto,
  DelLinkTypeDto,
  LinkTypeDetailDto,
  LinkTypeListDto,
  UpdateLinkTypeDto,
} from '../dto/linkPlatform.dto';

@Controller('link_platform')
export class LinkPlatformController {
  constructor(private readonly linkService: LinkPlatformService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getList(@Body() body: LinkTypeListDto) {
    const lists = await this.linkService.getLinkPlatformList(body);
    return {
      code: 200,
      result: lists,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/detail')
  async getLinkDetail(@Body() body: LinkTypeDetailDto) {
    const lists = await this.linkService.getLinkDetail(body);
    return {
      code: 200,
      result: lists,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async addLink(@Body() body: AddLinkTypeDto) {
    await this.linkService.addLink(body);
    return {
      code: 200,
      result: '添加成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async updateLetter(@Body() body: UpdateLinkTypeDto) {
    await this.linkService.updateLink(body);
    return {
      code: 200,
      result: '编辑成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delLetter(@Body() body: DelLinkTypeDto) {
    await this.linkService.delLink(body);
    return {
      code: 200,
      result: '删除成功',
    };
  }
}
