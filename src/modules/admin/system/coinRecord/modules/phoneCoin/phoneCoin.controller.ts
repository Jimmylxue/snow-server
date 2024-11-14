import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PhoneCoinService } from './phoneCoin.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../../../user/services/user.service';
import { PhoneCoinListDto } from '../../dto/phoneCoin.dto';

@Controller('phone_coin')
export class PhoneCoinController {
  constructor(
    private readonly phoneCoinService: PhoneCoinService,
    private readonly userService: UserService,
  ) {}

  /**
   * 查询一个 id 下的 金币数量
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/info')
  async info(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;

    const _userInfo = await this.userService.getDetailById(userId);

    if (!_userInfo.phone) {
      return {
        code: 10000,
        result: '账号异常 - 账户未绑定手机号',
      };
    }
    const phoneCoin = await this.phoneCoinService.getPhoneCoin(
      _userInfo.phone,
      userId,
    );
    return {
      code: 200,
      result: phoneCoin,
    };
  }

  /**
   * B 端 查询记录 -> 根据手机号查询
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async addHabit(@Body() body: PhoneCoinListDto) {
    const records = await this.phoneCoinService.getPhoneCoinList(body);
    return {
      code: 200,
      result: records,
    };
  }
}
