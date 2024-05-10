import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckInRecord } from '../../entities/checkInRecord.entity';
import { SignInDto } from '../../dto/checkIn.dto';
import { getTimes } from '@src/utils';

@Injectable()
export class CheckInService {
  constructor(
    @InjectRepository(CheckInRecord)
    private readonly checkInRepository: Repository<CheckInRecord>,
  ) {}

  /**
   * 签到操作 如果当天有记录 则删除 没有则签到
   */
  async signIn(params: SignInDto, userId: number) {
    const timeDate = params.signDate || getTimes();
    const [year, month, day] = timeDate.split('-');
    const record = await this.findDateRecord(
      {
        signDate: timeDate,
        habitId: params.habitId,
      },
      userId,
    );
    if (record?.[0]?.checkInId) {
      return this.delRecord(record?.[0]?.checkInId);
    }
    const checkInRecord = this.checkInRepository.create();
    checkInRecord.user = userId;
    checkInRecord.habit = params.habitId;
    checkInRecord.signYear = year;
    checkInRecord.signMonth = month;
    checkInRecord.signDay = day;
    checkInRecord.signDate = timeDate;
    return await this.checkInRepository.save(checkInRecord);
  }

  /**
   * 查找 某一个日期的 打卡记录
   */
  async findDateRecord(
    params: {
      signDate?: string;
      signYear?: string;
      signMonth?: string;
      signDay?: string;
      habitId?: number | number[];
    },
    userId: number,
    withRelation: boolean = true,
  ) {
    const { signDate, signYear, signMonth, signDay, habitId } = params || {};
    return await this.checkInRepository.find({
      relations: {
        habit: withRelation ? true : false,
      },
      where: {
        signDate,
        signYear,
        signMonth,
        signDay,
        habit: { habitId },
        user: { id: userId },
      },
    });
  }

  /**
   * 查询数量
   * @returns number
   */
  async findAllCount(
    params: {
      signDate?: string;
      signYear?: string;
      signMonth?: string;
      signDay?: string;
      habitId?: number;
    },
    userId: number,
  ) {
    const { signDate, signYear, signMonth, signDay, habitId } = params || {};
    return await this.checkInRepository.count({
      where: {
        signDate,
        signYear,
        signMonth,
        signDay,
        habit: { habitId },
        user: { id: userId },
      },
    });
  }

  async delRecord(checkInId) {
    return await this.checkInRepository.delete({ checkInId });
  }

  /**
   * 获取连续打卡天数
   */
  getContinuityCount(records: CheckInRecord[]) {
    let sortRecords = records.sort((a, b) => +b.signDay - +a.signDay);
    let count = 0;
    if (sortRecords.length > 0) {
      count = 1;
    }
    let pre = +sortRecords[0]?.signDay;
    for (let i = 1; i < sortRecords.length; i++) {
      const currentDay = +sortRecords[i].signDay;
      if (pre - currentDay === 1) {
        count++;
        pre = currentDay;
      } else {
        break;
      }
    }
    return count;
  }

  groupByHabitId(records: CheckInRecord[]): CheckInRecord[][] {
    const groupedRecords = {};
    records.forEach((record) => {
      const habitId = record.habit.habitId;
      if (!groupedRecords[habitId]) {
        groupedRecords[habitId] = [];
      }
      groupedRecords[habitId].push(record);
    });
    return Object.values(groupedRecords);
  }

  getNearWeakInfo(
    list: CheckInRecord[],
    nearWeek: {
      date: string;
      dayOfWeek: string;
    }[],
  ) {
    const listDates = list.map((item) => item.signDate);
    return nearWeek.map((info) => {
      const isSign = !!listDates.includes(info.date);
      return { ...info, isSign };
    });
  }
}
