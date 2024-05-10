import { Injectable } from '@nestjs/common';
import { station } from './station';
import { TransDetailDto, TransListDto } from './dto/train.dto';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class TrainService {
  stationInfo = Object.values(station.stationInfo);

  constructor(private httpService: HttpService) {}

  async getTrainList(params: TransListDto) {
    const { date, from, to, type, trainNo } = params;
    const fromCode = this.getStateInfoByCityName(from).code;
    const toCode = this.getStateInfoByCityName(to).code;
    const trainListInfo = [];

    try {
      const res = await this.httpService.axiosRef.get<any, AxiosResponse<any>>(
        `https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=${date}&leftTicketDTO.from_station=${fromCode}&leftTicketDTO.to_station=${toCode}&purpose_codes=${type}`,
        {
          headers: {
            Cookie: '_uab_collina=WX:xiaosin2333; JSESSIONID=WX:xiaosin2333;',
          },
        },
      );

      if (res.data && res.data.httpstatus === 200) {
        const { data = {} } = res.data;
        let { result = [] } = data;

        if (result.length <= 0) {
          console.log('暂无车票信息');
          return false;
        }

        result.map((item) => {
          let formatData = this.formatTrainData(item);
          if (trainNo) {
            if (formatData.trainNo === trainNo) {
              trainListInfo.push(formatData);
            }
          } else {
            trainListInfo.push(formatData);
          }
        });
        return {
          code: 200,
          result: {
            date,
            from_station: fromCode,
            to_station: toCode,
            trainList: trainListInfo,
          },
        };
      } else {
        return {
          code: 500,
          result: res.data,
        };
      }
    } catch (error) {
      return { code: 500, message: JSON.stringify(error) };
    }
  }

  async getTrainDetail(params: TransDetailDto) {
    const {
      depart_date,
      train_no,
      from_station_telecode,
      to_station_telecode,
    } = params;

    const res = await this.httpService.axiosRef.get<any, AxiosResponse<any>>(
      `https://kyfw.12306.cn/otn/czxx/queryByTrainNo?train_no=${train_no}&from_station_telecode=${from_station_telecode}&to_station_telecode=${to_station_telecode}&depart_date=${depart_date}`,
      {
        headers: {
          Cookie: '_uab_collina=WX:xiaosin2333; JSESSIONID=WX:xiaosin2333;',
        },
      },
    );

    if (res.data && res.data.httpstatus === 200) {
      const { data } = res.data;
      return {
        code: 200,
        data,
      };
    } else {
      return {
        code: 500,
        result: res.data,
      };
    }
  }

  /**
   * 根据城市中文名称，获取站点信息
   * @param cityName string
   */
  getStateInfoByCityName(cityName: string): {
    name: string;
    code: string;
    pinyin: string;
    suoxie: string;
    other: string;
  } {
    let stateInfo: any;
    this.stationInfo.find((item) => {
      if (Array.isArray(item)) {
        return item.find((it) => {
          if (it.name === cityName) {
            stateInfo = it;
          }
        });
      } else {
        if (item.name === cityName) {
          stateInfo = item;
        }
      }
    });
    if (!stateInfo) {
      throw new Error(`请检查站点名称是否正确：${cityName}`);
    }
    return stateInfo;
  }

  /**
   * 格式化车次数据
   */
  formatTrainData(data) {
    let ret: {
      trainNo?: string; //车次
      trainNumber?: string; //车票号
      startTime?: string; //出发时间
      endTime?: string; //到达时间
      fromStation?: string; //出发站代号
      toStation?: string; //到达站代号
      date?: string; //出发日期
      canWebBuy?: string; //是否能购买：Y 可以
      rw?: string; //软卧
      rz?: string; //软座
      yz?: string;
      wz?: string; //无座
      yw?: string; //硬卧
      edz?: string; //二等座
      ydz?: string; //一等座
      swz?: string; //商务座
    } = {};
    for (let i = 0; i < data.length; i++) {
      let row = data.split('|');
      ret = {
        trainNo: row[3], //车次
        trainNumber: row[2], //车票号
        startTime: row[8], //出发时间
        endTime: row[9], //到达时间
        fromStation: row[6], //出发站代号
        toStation: row[7], //到达站代号
        date: row[13], //出发日期
        canWebBuy: row[11], //是否能购买：Y 可以
        rw: row[23] ? row[23] : '无', //软卧
        rz: row[24] ? row[24] : '无', //软座
        yz: row[29] ? row[29] : '无',
        wz: row[26] ? row[26] : '无', //无座
        yw: row[28] ? row[28] : '无', //硬卧
        edz: row[30] ? row[30] : '无', //二等座
        ydz: row[31] ? row[31] : '无', //一等座
        swz: row[32] ? row[32] : '无', //商务座
      };
    }
    return ret;
  }
}
