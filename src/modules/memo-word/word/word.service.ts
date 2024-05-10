import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from '../entities/words.entity';
import { DelWordBody, ListWordBody, SaveWordBody } from '../dto/word.dto';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
  ) {}

  async getUserWords(params: ListWordBody) {
    const { userId, page, pageSize, languageId, sort, word, chineseMean } =
      params;

    // 分页操作
    const qb = this.wordRepository.createQueryBuilder('snow_memo_words');
    const [result, total] = await qb
      .orderBy('snow_memo_words.wordId', sort as any)
      .where('snow_memo_words.userId = :userId', { userId })
      .andWhere('snow_memo_words.languageId LIKE :languageId', {
        languageId: languageId || '%',
      })
      .andWhere('snow_memo_words.word LIKE :word', {
        word: word || '%',
      })
      .andWhere('snow_memo_words.chineseMean LIKE :chineseMean', {
        chineseMean: chineseMean || '%',
      })
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .getManyAndCount();
    return {
      result,
      total,
    };
  }

  /**
   * 检查用户是否收藏这个单词
   */
  async CheckUserWords(params: SaveWordBody) {
    return await this.wordRepository.findAndCountBy({
      userId: params.userId,
      languageId: params.languageId,
      word: params.word,
    });
  }

  async saveWords(params: SaveWordBody) {
    const [_, count] = await this.CheckUserWords(params);
    if (count > 0) {
      return { status: 2, message: '您已在小本本记录该单词' };
    }
    await this.wordRepository.insert({ ...params });
    return { status: 1, message: '添加成功' };
  }

  async delWords(params: DelWordBody) {
    await this.wordRepository.delete({ ...params });
    return { status: 1, message: '删除成功' };
  }
}
