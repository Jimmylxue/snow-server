import { diffTime, getTimes } from '@src/utils';
import { import_day_type, TBaseMsgType } from './type';

export const baseMsg: TBaseMsgType = {
  birthday: '1998-10-11', // 女友出生日期
  love: '2017-11-07', // 在一起的日期
  today: getTimes(),
  pay: '05', // 发薪日 -- 每月五号
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
  individual: 0, // 过的多少个生日
  anniversary: 0, //在一起几年
  flag: 0,
};

// 上交工资
export function getPayDay() {
  updateDate();
  const { day, month, pay, year, today } = baseMsg;
  let goalTime = ''; //
  if (day > Number(pay)) {
    if (month == 12) {
      goalTime = `${year + 1}-01-${pay}`;
    } else {
      goalTime = `${year}-${
        month + 1 > 9 ? month + 1 : '0' + (month + 1)
      }-${pay}`;
    }
  } else {
    goalTime = `${year}-${month > 9 ? month : '0' + month}-${pay}`;
  }
  return Math.abs(diffTime(today, goalTime, 'day'));
}

export function getLoveDay() {
  updateDate();
  return Math.abs(diffTime(baseMsg.today, baseMsg.love, 'day'));
}

export function getBirthday() {
  updateDate();
  const { year, today, birthday } = baseMsg;
  let goalTime = ''; // 下次生日的日期 => 和当前日期对比，计算出时间差
  const [_, birMonth, birDay] = birthday.split('-');
  if (
    new Date(`${String(year)}-${birMonth}-${birDay}`).getTime() >
    new Date(today).getTime()
  ) {
    // 今年生日
    goalTime = `${String(year)}-${birMonth}-${birDay}`;
  } else {
    // 明年生日
    goalTime = `${String(year + 1)}-${birMonth}-${birDay}`;
  }
  return diffTime(goalTime, today, 'day');
}

// 判断今天是不是重要的日子的一天
export function getImportantDay() {
  updateDate();
  const { today, birthday, love, pay } = baseMsg;
  /**
   * flag :
   *  0 普通的日子
   *  1 发薪日
   *  2 生日
   *  3 在一起纪念日
   */

  let flag: import_day_type = 0;

  const [year, month, day] = today.split('-');
  const [heryear, hermonth, herday] = birthday.split('-');
  const [loveyear, lovemonth, loveday] = love.split('-');
  baseMsg.individual = Number(year) - Number(heryear);
  baseMsg.anniversary = Number(year) - Number(loveyear);

  if (day == pay) {
    flag = 1;
  } else if (month == hermonth && day == herday) {
    flag = 2;
  } else if (month == lovemonth && day == loveday) {
    flag = 3;
  }

  baseMsg.flag = flag;
}

// 刷新日期
function updateDate() {
  baseMsg.today = getTimes();
  baseMsg.year = new Date().getFullYear();
  baseMsg.month = new Date().getMonth() + 1;
  baseMsg.day = new Date().getDate();
}
