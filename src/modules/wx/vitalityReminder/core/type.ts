export enum import_day_type {
  普通的日子,
  发薪日,
  生日,
  相恋纪念日,
}

export type TBaseMsgType = {
  birthday: string; // 女友出生日期
  love: string; // 在一起的日期
  today: string;
  pay: string; // 发薪日 -- 每月五号
  year: number;
  month: number;
  day: number;
  individual: number; // 过的多少个生日
  anniversary: number; //在一起几年
  flag: import_day_type;
};
