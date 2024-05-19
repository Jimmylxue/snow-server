import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddGeoRecordDto, GeoRecordListDto } from '../../dto/geo.dto';
import { UserGeoService } from '../../services/userGeo.service';

@Controller('userGeo')
export class UserGeoController {
  constructor(private readonly userGeoService: UserGeoService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  async addRecord(@Body() body: AddGeoRecordDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    await this.userGeoService.addGeoRecord(body, userId);
    return {
      code: 200,
      result: '操作成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async getList(@Body() body: GeoRecordListDto, @Req() auth) {
    const list = await this.userGeoService.getAllList(body);
    return {
      code: 200,
      result: list,
    };
  }
}
