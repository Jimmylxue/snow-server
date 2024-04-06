import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CheckInService } from './checkIn.service';
import { SignInDto, SignRecordDto } from '../../dto/checkIn.dto';
import { getDaysByMonth, getNearWeekDateMessage } from '@src/utils';
import { HabitService } from '../habit/habit.service';

@Controller('checkIn')
export class CheckInController {
  constructor(
    private readonly habitService: HabitService,
    private readonly checkInService: CheckInService,
  ) {}

  /**
   * 签到
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/sign')
  async signIn(@Body() body: SignInDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const records = await this.checkInService.signIn(body, userId);
    return {
      code: 200,
      result: records,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/clist')
  async getSignList(@Body() body: SignRecordDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const habits = await this.habitService.getUserHabit(body, userId);
    const records = (
      await this.checkInService.findDateRecord(body, userId)
    ).filter((item) => item.habit.status === body.status);

    const groupByList = this.checkInService.groupByHabitId(records);
    const nearWeek = getNearWeekDateMessage();
    const habDataList = groupByList.map((group) => {
      const nearWeekInfo = this.checkInService.getNearWeakInfo(group, nearWeek);
      return { ...group[0].habit, nearWeekInfo };
    });
    const hasDataHabitIds = habDataList?.map((item) => item?.habitId);
    const result = habits.map((hab) => {
      if (hasDataHabitIds.includes(hab.habitId)) {
        return habDataList.find((item) => item.habitId === hab.habitId);
      }
      return {
        ...hab,
        nearWeekInfo: nearWeek.map((item) => ({ ...item, isSign: false })),
      };
    });
    return {
      code: 200,
      result,
    };
  }

  /**
   * 获取月度打卡记录
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/detail')
  async getSignRecord(@Body() body: SignRecordDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const records = await this.checkInService.findDateRecord(
      body,
      userId,
      false,
    );
    /** 月打卡数 */
    const monthCount = records.length;
    /** 总打卡数 */
    const allCount = await this.checkInService.findAllCount(
      {
        habitId: body.habitId,
      },
      userId,
    );
    /** 月完成率数 */
    const monthRate = Number(
      monthCount / getDaysByMonth(+body.signYear, +body.signMonth),
    ).toFixed(2);
    const habit = await this.habitService.getUserHabit(
      { habitId: body.habitId },
      userId,
    );
    /** 当前连续打卡数 */
    const monthContinuityCount =
      this.checkInService.getContinuityCount(records);
    return {
      code: 200,
      result: {
        monthCount,
        allCount,
        monthRate,
        monthContinuityCount,
        records: records.filter((item) => {
          const { habit, ...args } = item;
          return args;
        }),
        habit: habit?.[0],
      },
    };
  }
}
