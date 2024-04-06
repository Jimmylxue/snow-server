import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DelLetterDto,
  LetterListDto,
  UpdateLetterDto,
} from '../dto/letter.dto';
import { Letter } from '../entities/letter.entity';
import { sendLetterDto } from '../dto/send.dto';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
  ) {}

  async letterList(params: LetterListDto) {
    const { page, pageSize, sort, title, platform, letterId } = params;
    // 分页操作
    const qb = this.letterRepository.createQueryBuilder('letter');
    const [result, total] = await qb
      // @ts-ignore
      .orderBy('letter.letterId', sort)
      .where('letter.letterId LIKE :letterId', {
        letterId: letterId || '%',
      })
      .andWhere('letter.title LIKE :title', {
        title: title || '%',
      })
      .andWhere('letter.platform LIKE :platform', {
        platform: [undefined, null].includes(platform) ? '%' : platform,
      })
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .getManyAndCount();

    return {
      page: page,
      result,
      total,
    };
  }

  async addLetter(params: sendLetterDto) {
    const letter = this.letterRepository.create();
    letter.title = params.title;
    letter.content = params.content;
    letter.platform = params.platform;
    return await this.letterRepository.save(letter);
  }

  async updateLetter(body: UpdateLetterDto) {
    const { letterId, ...params } = body;
    const qb = this.letterRepository.createQueryBuilder('user');
    return await qb
      .update(Letter)
      .set(params)
      .where('letter.letterId = :letterId', { letterId })
      .execute();
  }

  async delLetter(body: DelLetterDto) {
    return await this.letterRepository.delete({ letterId: body.letterId });
  }
}
