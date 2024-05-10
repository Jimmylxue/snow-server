import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Background } from '../../entities/background.entity';
import { loveStatus } from '../../controllers/background/dto/bingBg.dto';
import { BingBgStore } from '../../entities/bingBgStore.entity';
import { TBingImageList } from '@src/types';

@Injectable()
export class BingBgService {
  constructor(
    @InjectRepository(Background)
    private readonly backgroundRepository: Repository<Background>,
    @InjectRepository(BingBgStore)
    private readonly bingBgStoreRepository: Repository<BingBgStore>,
    private httpService: HttpService,
  ) {}
  async getBackground(): Promise<TBingImageList | undefined> {
    // 近7日的bing美图 n => 数量 最多为7
    const { data: imgList } = await this.httpService.axiosRef.get<
      any,
      AxiosResponse<TBingImageList>
    >(`https://cn.bing.com/HPImageArchive.aspx?format=js&n=7&uhd=1`);
    if (imgList?.images?.length) {
      return imgList;
    }
    return;
  }

  async addImage({ background, date }: loveStatus) {
    const imgList = await this.backgroundRepository.findBy({ date });
    console.log(imgList);
    if (imgList.find((item) => item.imgSrc === background)) {
      return { status: 0, message: '图片已经收藏过了' };
    }
    try {
      await this.backgroundRepository.insert({
        date: date,
        imgSrc: background,
      });
      return { status: 1, message: '收藏成功' };
    } catch (err) {
      return { status: 0, message: JSON.stringify(err) };
    }
  }

  async storeTodayBg() {
    const { data: imgList } = await this.httpService.axiosRef.get<
      any,
      AxiosResponse<TBingImageList>
    >(`https://cn.bing.com/HPImageArchive.aspx?format=js&n=1&uhd=1`);
    if (imgList?.images?.length) {
      const { startdate, urlbase, copyright, title } = imgList?.images?.[0];
      try {
        const findToday = await this.bingBgStoreRepository.findOneBy({
          startdate,
        });
        if (findToday?.id) {
          return { code: 500, message: '今日图片已收藏' };
        }
        await this.bingBgStoreRepository.insert({
          startdate,
          url: `https://cn.bing.com/${urlbase}_UHD.jpg`,
          urlbase: `https://cn.bing.com/${urlbase}_1920x1080.jpg`,
          copyright,
          title,
        });
        return { code: 200, message: '每日图片保存成功' };
      } catch (err) {
        return { code: 500, message: JSON.stringify(err.message) };
      }
    }
    return;
  }
}
