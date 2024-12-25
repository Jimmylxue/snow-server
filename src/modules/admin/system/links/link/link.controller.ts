import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LinkService } from './link.service';
import {
  AddLinkDto,
  CLinkListDto,
  DelLinkDto,
  LinkDetailDto,
  LinkListDto,
  UpdateLinkAllDto,
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
  @Post('/detail')
  async getLinkDetail(@Body() body: LinkDetailDto) {
    const lists = await this.linkService.getLinkDetail(body);
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

  /**
   * 获取C端的 随机获取数据
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/c_list')
  async getCList(@Body() body: CLinkListDto) {
    const lists = await this.linkService.getRandomPageData(body);
    return {
      code: 200,
      result: lists,
    };
  }

  /**
   * 更新所有的链接
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/update_all')
  async updateLinkAll(@Body() body: UpdateLinkAllDto) {
    await this.linkService.updateLinkAll(body);
    return {
      code: 200,
      result: '编辑成功',
    };
  }

  /**
   * 更新所有的链接
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/del_all')
  async deleteLinkAll(@Body() body: { linkTypeId: number }) {
    await this.linkService.deleteLinkAll(body);
    return {
      code: 200,
      result: '删除成功',
    };
  }
}
