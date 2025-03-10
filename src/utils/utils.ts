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
  const result: { date: string; dayOfWeek: string }[] = [];
  const today = new Date();
  const chineseDayOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
  for (let i = 0; i < 7; i++) {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i);
    const day = pastDate.getDay();
    const dayOfWeek = '星期' + chineseDayOfWeek[day];
    const formattedDate =
      pastDate.getFullYear() +
      '-' +
      String(pastDate.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(pastDate.getDate()).padStart(2, '0');
    result.push({ date: formattedDate, dayOfWeek: dayOfWeek });
  }
  return result.reverse();
}

export function getCurrentMonthTimestamps() {
  // 获取当前日期
  const now = new Date();

  // 获取本月的开始时间
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startTime = startOfMonth.getTime(); // 开始时间的时间戳

  // 获取本月的结束时间
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const endTime = endOfMonth.getTime(); // 结束时间的时间戳

  return {
    startTime,
    endTime,
  };
}

export function formatFullTime(timeStamps: number | string) {
  return dayjs(timeStamps).format('YYYY-MM-DD HH:mm:ss');
}
