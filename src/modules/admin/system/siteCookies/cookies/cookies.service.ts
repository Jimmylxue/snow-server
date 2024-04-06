import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cookies } from './cookies.entity';

@Injectable()
export class CookiesService {
  constructor(
    @InjectRepository(Cookies)
    private readonly cookiesRepository: Repository<Cookies>,
  ) {}
  async getCookiesList() {
    return this.cookiesRepository.find();
  }

  async getUserCookies(userId: number) {
    const taskTypes = await this.cookiesRepository.findBy({ userId });
    return taskTypes;
  }

  async getCookiesDetail(website_id: number, userId) {
    const taskTypes = await this.cookiesRepository.findBy({
      userId,
      website_id,
    });
    return taskTypes;
  }

  async updateCookies(updateParams: any) {
    const { site_cookie_id, ...params } = updateParams;
    const qb = this.cookiesRepository.createQueryBuilder('site_cookie');
    qb.update(Cookies)
      .set(params)
      .where('site_cookie.site_cookie_id = :site_cookie_id', { site_cookie_id })
      .execute();
    return { status: 1, message: '更新成功' };
  }

  async hasCookies(website_id, userId): Promise<Cookies> {
    const userCookie = await this.cookiesRepository.findOneBy({
      website_id,
      userId,
    });
    return userCookie;
  }
}
