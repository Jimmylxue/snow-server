import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ManagerSettingService } from '../../services/managerSetting.service';
import { SaveSettingDto } from '../../dto/managerSetting.dto';

@Controller('managerSetting')
export class ManagerSettingController {
  constructor(private readonly managerSettingService: ManagerSettingService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('save')
  async saveSetting(@Body() body: SaveSettingDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return await this.managerSettingService.saveSetting(body, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('info')
  async getSetting(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    return await this.managerSettingService.getSetting(userId);
  }
}
