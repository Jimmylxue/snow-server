import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Link } from '../entities/links.entity';
import { formatFullTime } from '@src/utils';
import {
  AddLinkDto,
  DelLinkDto,
  LinkListDto,
  UpdateLinkDto,
} from '../dto/link.dto';
import { ELogicDel } from '@src/types/base';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async getLinkList(body: LinkListDto) {
    const { page, pageSize, startTime, endTime, sort, ...where } = body;
    const [result, total] = await this.linkRepository.findAndCount({
      where: {
        ...where,
        logicDel: ELogicDel.未删除,
        createdTime: startTime
          ? Between(
              formatFullTime(Number(startTime)),
              formatFullTime(Number(endTime)),
            )
          : undefined,
      },
      order: {
        linkId: sort,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      page: page,
      result,
      total,
    };
  }

  async addLink(params: AddLinkDto) {
    const letter = this.linkRepository.create();
    letter.title = params.title;
    letter.mainImage = params.mainImage;
    letter.fullLink = params.fullLink;
    letter.price = params.price;
    return await this.linkRepository.save(letter);
  }

  async updateLink(body: UpdateLinkDto) {
    const { linkId, ...params } = body;
    await this.linkRepository.update(linkId, {
      ...params,
    });
  }

  async delLink(body: DelLinkDto) {
    await this.linkRepository.update(body.linkId, {
      logicDel: ELogicDel.逻辑删除,
    });
  }
}