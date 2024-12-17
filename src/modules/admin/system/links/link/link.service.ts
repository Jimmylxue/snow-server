import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { Link } from '../entities/links.entity';
import { formatFullTime } from '@src/utils';
import {
  AddLinkDto,
  CLinkListDto,
  DelLinkDto,
  LinkDetailDto,
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

  async getLinkDetail(body: LinkDetailDto) {
    const data = await this.linkRepository.findOneBy({
      linkId: body.linkId,
    });
    return data;
  }

  async addLink(params: AddLinkDto) {
    const letter = this.linkRepository.create();
    letter.title = params.title;
    letter.mainImage = params.mainImage;
    letter.fullLink = params.fullLink;
    letter.price = params.price;
    letter.coin = params.coin;
    letter.visitTime = params.visitTime;
    letter.linkTypeId = params.linkTypeId;
    // letter.linkType = params.linkTypeId;
    return await this.linkRepository.save(letter);
  }

  async updateLink(body: UpdateLinkDto) {
    const { linkIds, ...params } = body;
    await this.linkRepository.update(
      {
        linkId: In(linkIds),
      },
      {
        ...params,
      },
    );
  }

  async delLink(body: DelLinkDto) {
    await this.linkRepository.update(
      {
        linkId: In(body.linkIds),
      },
      {
        logicDel: ELogicDel.逻辑删除,
      },
    );
  }

  async getRandomPageData(body: CLinkListDto) {
    const pageSize = body?.pageSize || 3;
    const totalRecords = await this.linkRepository.count({
      where: {
        linkTypeId: body.linkTypeId,
        logicDel: ELogicDel.未删除,
      },
    });

    const totalPages = Math.ceil(totalRecords / pageSize);
    const randomPage = Math.floor(Math.random() * totalPages);

    // 查询数据
    const data = await this.linkRepository.find({
      where: {
        linkTypeId: body.linkTypeId,
        logicDel: ELogicDel.未删除,
      },
      skip: randomPage * pageSize,
      take: pageSize,
    });

    return data;
  }
}
