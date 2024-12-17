import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RichTextListDto, UpdateRichTextDto } from '../dto/richText.dto';
import { ELogicDel } from '@src/types/base';
import { RichText } from '../entities/richText.entity';

@Injectable()
export class RichTextService {
  constructor(
    @InjectRepository(RichText)
    private readonly richTextRepository: Repository<RichText>,
  ) {}

  async getRichTextList(body: RichTextListDto) {
    const { ...where } = body;
    const result = await this.richTextRepository.find({
      where: {
        ...where,
        logicDel: ELogicDel.未删除,
      },
    });
    return result;
  }

  async updateRichText(body: UpdateRichTextDto) {
    const { richTextId, ...params } = body;
    await this.richTextRepository.update(richTextId, {
      ...params,
    });
  }
}
