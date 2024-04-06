var dayjs = require('dayjs');

/**
 * 获取当天的日期信息
 * @param format string
 * @returns string
 */
export function getTimes(format: string = 'YYYY-MM-DD'): string {
  return dayjs().format(format);
}

export function diffTime(date1Str, date2Str, type = 'day') {
  // return dayjs(date1)
  const date1 = dayjs(date1Str);
  const date2 = dayjs(date2Str);

  return date1.diff(date2, type);
}

/**
 * 生成随机6位字符
 * @returns string
 */
export function generateRandomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomCode = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomCode += characters.charAt(randomIndex);
  }

  return randomCode;
}

/**
 * 检查是否是qq邮箱
 * @param mail string
 */
export function isQQMail(mail: string) {
  return /^[1-9]\d{4,10}@qq\.com$/.test(mail);
}

/**
 * 获取某个月的天数
 */
export function getDaysByMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

/**
 * 根据一个key 将数组切个多个数组
 * @param arr any[]
 * @param key string
 * @returns
 */
export function splitArrayByKey(arr, key) {
  const result = {};
  arr.forEach((item) => {
    const keyValue = item[key];
    if (!result[keyValue]) {
      result[keyValue] = [];
    }
    result[keyValue].push(item);
  });
  return Object.values(result);
}

/**
 * 获取进一周 日期数据
 */
export function getNearWeekDateMessage() {
  let result: { date: string; dayOfWeek: string }[] = [];
  let today = new Date();
  let chineseDayOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
  for (let i = 0; i < 7; i++) {
    let pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i);
    let day = pastDate.getDay();
    let dayOfWeek = '星期' + chineseDayOfWeek[day];
    let formattedDate =
      pastDate.getFullYear() +
      '-' +
      String(pastDate.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(pastDate.getDate()).padStart(2, '0');
    result.push({ date: formattedDate, dayOfWeek: dayOfWeek });
  }
  return result.reverse();
}
