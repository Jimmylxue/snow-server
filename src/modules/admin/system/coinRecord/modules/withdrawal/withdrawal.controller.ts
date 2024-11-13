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

@Controller('withdrawal')
export class WithdrawalController {
  constructor(
    private readonly withdrawalService: WithdrawalService,
    private readonly userService: UserService,
  ) {}
  /**
   * B 端 查询记录
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async addHabit(@Body() body: WithdrawalRecordDto) {
    const records = await this.withdrawalService.getUserWithdrawalRecord(
      body,
      body.userId,
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
    const records = await this.withdrawalService.getUserWithdrawalRecord(
      body,
      userId,
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
    const { startTime, endTime } = getCurrentMonthTimestamps();
    const records = await this.withdrawalService.getUserWithdrawalRecord(
      {
        page: 1,
        pageSize: 10,
        startTime: String(startTime),
        endTime: String(endTime),
        payStatus: 1,
      },
      userId,
      false,
    );
    if (records?.result?.length >= 2) {
      return {
        code: 10000,
        result: '本月已超过提现次数',
      };
    }
    const userCoin = await this.userService.getUserCoin(userId);
    if (body.withdrawalCoin > userCoin) {
      return {
        code: 10000,
        result: '提现金额有误',
      };
    }
    await this.withdrawalService.carryWithdrawal(body, userId, userCoin);
    await this.userService.updateUserCoin(
      userId,
      userCoin - body.withdrawalCoin,
    );
    return {
      code: 200,
      result: '操作成功',
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
    const userCoin = await this.userService.getUserCoin(userId);
    const record = await this.withdrawalService.recordDetail(body);
    if (record?.userId !== userId) {
      return {
        code: 10000,
        result: '数据异常',
      };
    }
    await this.withdrawalService.cancelWithdrawal(body);
    await this.userService.updateUserCoin(
      userId,
      userCoin + record.withdrawalCoin,
    );
    return {
      code: 200,
      result: '操作成功',
    };
  }
}
