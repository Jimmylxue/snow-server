import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionType } from '../../entities/questionType.entity';
import {
  AddQuestionDto,
  AddQuestionTypeCompleteDto,
  AddQuestionTypeDto,
  DelQuestionDto,
  DelQuestionTypeDto,
  EditQuestionDto,
  EditQuestionTypeDto,
  QuestionListDto,
  QuestionTypeCompleteRankDto,
  QuestionTypeListDto,
  RandomQuestionDto,
} from '../../dto/question.dto';
import { Question } from '../../entities/question.entity';
import { QuestionTypeComplete } from '../../entities/questionTypeComplete.entity';
import { User } from '@src/modules/admin/system/user/entities/user.entity';
@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionType)
    private readonly questionTypeRepository: Repository<QuestionType>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionTypeComplete)
    private readonly questionTypeCompleteRepository: Repository<QuestionTypeComplete>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllList(body: QuestionTypeListDto) {
    return await this.questionTypeRepository.find({
      where: {
        ...body,
      },
    });
  }

  async addQuestionType(params: AddQuestionTypeDto) {
    const type = this.questionTypeRepository.create();
    type.name = params.name;
    type.desc = params.desc;
    return await this.questionTypeRepository.save(type);
  }

  async delQuestionType(params: DelQuestionTypeDto) {
    // return await this.questionTypeRepository.delete({ id: params.id });
  }

  async editQuestionType(updateParams: EditQuestionTypeDto) {
    const { id, ...params } = updateParams;
    const qb = this.questionRepository.createQueryBuilder('questionType');
    qb.update(QuestionType)
      .set(params)
      .where('questionType.id = :id', { id })
      .execute();
    return { status: 1, message: '更新成功' };
  }

  async getAllQuestionList(body: QuestionListDto) {
    return await this.questionRepository.find({
      // select: ['recordId', 'letter', 'status', 'createdTime'],
      // relations: {
      //   letter: true,
      // },
      where: {
        ...body,
        // clubMemberId: userId,
      },
      order: {
        id: 'DESC',
      },
    });
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
    return await this.questionRepository.save(question);
  }

  async delQuestion(params: DelQuestionDto) {
    return await this.questionRepository.delete({ id: params.id });
  }

  async editQuestion(updateParams: EditQuestionDto) {
    const { id, ...params } = updateParams;
    const qb = this.questionRepository.createQueryBuilder('question');
    qb.update(Question)
      .set(params)
      .where('question.id = :id', { id })
      .execute();
    return { status: 1, message: '更新成功' };
  }

  async getRandomQuestion(params: RandomQuestionDto) {
    const qb = this.questionRepository.createQueryBuilder('question');
    return await qb
      .orderBy('RAND()')
      .where('question.typeId = :typeId', { typeId: params.typeId })
      .getMany();
    // .take(params.count || 10)
    // .getMany();
  }

  /**
   * 进度相关
   */
  async getCompleteList(userId: number) {
    console.log(userId);
    return await this.questionTypeCompleteRepository.find({
      where: {
        userId,
      },
    });
  }

  /**
   * 添加进度
   */
  async addComplete(params: AddQuestionTypeCompleteDto, userId: number) {
    /**
     * 如果有这个记录，则不添加
     */
    const record = await this.questionTypeCompleteRepository.findOne({
      where: {
        userId,
        questionTypeId: params.questionTypeId,
      },
    });
    if (record) {
      return { code: 200, message: '已存在' };
    }
    const complete = this.questionTypeCompleteRepository.create();
    complete.userId = userId;
    complete.questionTypeId = params.questionTypeId;
    complete.useTime = params.useTime;
    await this.questionTypeCompleteRepository.save(complete);
    return { code: 200, message: '添加成功' };
  }

  /**
   * 获取进度排行版
   *  查看当前用户超越人数的百分比（总人数就是用户表中的所有人的人数，），和本年度第一个完成章节的完成时间
   */
  async getCompleteRank(userId: number, body: QuestionTypeCompleteRankDto) {
    // 获取总用户数（分母）
    const total = await this.userRepository.count();

    // 获取完成该 questionTypeId 的用户数量（分子）
    const completeCount = await this.questionTypeCompleteRepository.count({
      where: { questionTypeId: body.questionTypeId },
    });

    console.log(total, completeCount);
    // 计算完成百分比
    const percentage = ((total - completeCount) / total) * 100;

    // 获取第一个完成这个 questionTypeId 的记录（按 useTime 排序）
    const firstComplete = await this.questionTypeCompleteRepository.findOne({
      where: { questionTypeId: body.questionTypeId },
      order: { useTime: 'ASC' },
      relations: ['user'],
    });

    return {
      percentage: Number(percentage.toFixed(2)) + '%', // 保留两位小数
      firstComplete,
      totalUsers: total,
      completedUsers: completeCount,
    };
  }
}
