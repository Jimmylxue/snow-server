import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { formatFullTime } from '@src/utils';
import { ELogicDel } from '@src/types/base';
import {
  AddLinkTypeDto,
  DelLinkTypeDto,
  LinkTypeDetailDto,
  LinkTypeListDto,
  UpdateLinkTypeDto,
} from '../dto/linkPlatform.dto';
import { LinkPlatform } from '../entities/linkPlatform.entity';

@Injectable()
export class LinkPlatformService {
  constructor(
    @InjectRepository(LinkPlatform)
    private readonly linkRepository: Repository<LinkPlatform>,
  ) {}

  async getLinkPlatformList(body: LinkTypeListDto) {
    const { startTime, endTime, sort, ...where } = body;
    const result = await this.linkRepository.find({
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
        linkTypeId: sort,
      },
    });
    return result;
  }

  async getLinkDetail(body: LinkTypeDetailDto) {
    const data = await this.linkRepository.findOneBy({
      linkTypeId: body.linkTypeId,
    });
    return data;
  }

  async addLink(params: AddLinkTypeDto) {
    const letter = this.linkRepository.create();
    letter.name = params.name;
    letter.mainImage = params.mainImage;
    letter.openStatus = params.openStatus;
    return await this.linkRepository.save(letter);
  }

  async updateLink(body: UpdateLinkTypeDto) {
    const { linkTypeId, ...params } = body;
    await this.linkRepository.update(linkTypeId, {
      ...params,
    });
  }

  async delLink(body: DelLinkTypeDto) {
    await this.linkRepository.update(body.linkTypeId, {
      logicDel: ELogicDel.逻辑删除,
    });
  }
}
