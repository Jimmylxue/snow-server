import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GainCoinService } from './gainCoin.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../../../user/services/user.service';
import { PhoneCoinService } from '../phoneCoin/phoneCoin.service';
import {
  CGainCoinRecordDto,
  GainCoinDto,
  GainCoinRecordDto,
} from '../../dto/gainCoin.dto';
import { LinkService } from '../../../links/link/link.service';
import { Admin } from '@src/decorators/admin.decorator';
import { Role } from '../../../user/entities/user.entity';

@Controller('gainCoin')
export class GainCoinController {
  constructor(
    private readonly gainCoinService: GainCoinService,
    private readonly linkService: LinkService,
    private readonly userService: UserService,
    private readonly phoneCoinService: PhoneCoinService,
  ) {}
  /**
   * B 端 查询 浏览 记录
   */
  @UseGuards(AuthGuard('jwt'))
  @Admin(Role.管理员)
  @Post('/list')
  async addHabit(@Body() body: GainCoinRecordDto) {
    const records = await this.gainCoinService.getUserPhoneGainCoinRecord(
      body,
      true,
    );
    return {
      code: 200,
      result: records,
    };
  }

  /**
   * C 端 使用的list 接口
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/c_list')
  async getList(@Body() body: CGainCoinRecordDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const _userInfo = await this.userService.getDetailById(userId);
    if (!_userInfo?.phone) {
      return {
        code: 10000,
        result: '账号异常 - 账户未绑定手机号',
      };
    }
    const records = await this.gainCoinService.getUserPhoneGainCoinRecord(
      { ...body, phone: _userInfo.phone },
      false,
    );
    return {
      code: 200,
      result: records,
    };
  }

  /**
   * C 端 刷完视频的 上报接口
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/gain')
  async carry(@Body() body: GainCoinDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;

    const linkDetail = await this.linkService.getLinkDetail(body);

    if (!linkDetail?.linkId) {
      return {
        code: 10000,
        result: '链接异常 - 请检查链接配置',
      };
    }

    const linkCoin = linkDetail.coin;

    const _userInfo = await this.userService.getDetailById(userId);
    if (!_userInfo?.phone) {
      return {
        code: 10000,
        result: '账号异常 - 账户未绑定手机号',
      };
    }
    const userCoin = await this.phoneCoinService.getPhoneCoin(
      _userInfo.phone,
      userId,
    );

    await this.gainCoinService.carryCoinToPhone(
      linkCoin,
      userId,
      userCoin,
      _userInfo.phone,
    );
    await this.phoneCoinService.updateUserPhoneCoin(
      _userInfo.phone,
      userCoin + linkCoin,
    );
    return {
      code: 200,
      result: `浏览完成，新增${linkCoin}枚金币`,
    };
  }
}
