import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { AuthGuard } from '@nestjs/passport';
import {
  CancelWithdrawalDto,
  CarryWithdrawalDto,
  CompleteWithdrawalDto,
  CWithdrawalRecordDto,
  WithdrawalRecordDto,
} from '../../dto/withdrawal.dto';
import { UserService } from '../../../user/services/user.service';
import { getCurrentMonthTimestamps } from '@src/utils';
import { PhoneCoinService } from '../phoneCoin/phoneCoin.service';

@Controller('withdrawal')
export class WithdrawalController {
  constructor(
    private readonly withdrawalService: WithdrawalService,
    private readonly userService: UserService,
    private readonly phoneCoinService: PhoneCoinService,
  ) {}
  /**
   * B 端 查询记录
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async addHabit(@Body() body: WithdrawalRecordDto) {
    const records = await this.withdrawalService.getUserPhoneWithdrawalRecord(
      body,
      true,
    );
    return {
      code: 200,
      result: records,
    };
  }

  /**
   * B 端  完成支付 接口
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/complete')
  async complete(@Body() body: CompleteWithdrawalDto) {
    await this.withdrawalService.completeWithdrawal(body);
    return {
      code: 200,
      result: '操作成功',
    };
  }

  /**
   * C 端 使用的list 接口
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/c_list')
  async getList(@Body() body: CWithdrawalRecordDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const _userInfo = await this.userService.getDetailById(userId);
    if (!_userInfo?.phone) {
      return {
        code: 10000,
        result: '账号异常 - 账户未绑定手机号',
      };
    }
    const records = await this.withdrawalService.getUserPhoneWithdrawalRecord(
      { ...body, phone: _userInfo.phone },
      false,
    );
    return {
      code: 200,
      result: records,
    };
  }

  /**
   * C 端 提现申请接口
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/carry')
  async carry(@Body() body: CarryWithdrawalDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const _userInfo = await this.userService.getDetailById(userId);
    if (!_userInfo?.phone) {
      return {
        code: 10000,
        result: '账号异常 - 账户未绑定手机号',
      };
    }
    const { startTime, endTime } = getCurrentMonthTimestamps();
    const records = await this.withdrawalService.getUserPhoneWithdrawalRecord(
      {
        page: 1,
        pageSize: 10,
        startTime: String(startTime),
        endTime: String(endTime),
        payStatus: 1,
        phone: _userInfo.phone,
      },
      false,
    );
    if (records?.result?.length >= 2) {
      return {
        code: 10000,
        result: '本月已超过提现次数',
      };
    }
    const userCoin = await this.phoneCoinService.getPhoneCoin(
      _userInfo.phone,
      userId,
    );
    if (body.withdrawalCoin > userCoin) {
      return {
        code: 10000,
        result: '提现金额有误',
      };
    }
    await this.withdrawalService.carryWithdrawal(
      body,
      userId,
      userCoin,
      _userInfo.phone,
    );
    await this.phoneCoinService.updateUserPhoneCoin(
      _userInfo.phone,
      userCoin - body.withdrawalCoin,
    );
    return {
      code: 200,
      result: '提现发起成功',
    };
  }

  /**
   * C 端 取消申请提现
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/cancel')
  async cancel(@Body() body: CancelWithdrawalDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
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
    const record = await this.withdrawalService.recordDetail(body);
    if (record?.phone !== _userInfo.phone) {
      return {
        code: 10000,
        result: '数据异常 - 手机号绑定异常',
      };
    }
    await this.withdrawalService.cancelWithdrawal(body);
    await this.phoneCoinService.updateUserPhoneCoin(
      _userInfo.phone,
      userCoin + record.withdrawalCoin,
    );
    return {
      code: 200,
      result: '取消申请成功',
    };
  }
}
