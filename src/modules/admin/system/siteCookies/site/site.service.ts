import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Site } from './site.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SiteService {
  constructor(
    @InjectRepository(Site)
    private readonly cookiesRepository: Repository<Site>,
  ) {}
  async getSiteList() {
    return this.cookiesRepository.find();
  }
}
