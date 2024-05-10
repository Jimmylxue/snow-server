import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionType } from '../../entities/questionType.entity';
import {
  AddQuestionDto,
  AddQuestionTypeDto,
  DelQuestionDto,
  DelQuestionTypeDto,
  RandomQuestionDto,
} from '../../dto/question.dto';
import { Question } from '../../entities/question.entity copy';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionType)
    private readonly questionTypeRepository: Repository<QuestionType>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async addQuestionType(params: AddQuestionTypeDto) {
    const type = this.questionTypeRepository.create();
    type.name = params.name;
    type.desc = params.desc;
    return await this.questionTypeRepository.save(type);
  }

  async delQuestionType(params: DelQuestionTypeDto) {
    return await this.questionTypeRepository.delete({ id: params.id });
  }

  async addQuestion(params: AddQuestionDto) {
    const question = this.questionRepository.create();
    question.name = params.name;
    question.desc = params.desc;
    question.examType = params.examType;
    question.typeId = params.typeId;
    question.type = params.typeId;
    question.option = params.option;
    question.answer = params.answer;
    return await this.questionTypeRepository.save(question);
  }

  async delQuestion(params: DelQuestionDto) {
    return await this.questionRepository.delete({ id: params.id });
  }

  async getRandomQuestion(params: RandomQuestionDto) {
    const qb = this.questionRepository.createQueryBuilder('question');
    return await qb
      .orderBy('RAND()')
      .take(params.count || 10)
      .getMany();
  }
}
