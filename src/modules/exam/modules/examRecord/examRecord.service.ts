import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { UserService } from '@src/modules/admin/system/user/services/user.service';
import { ExamRecord } from '../../entities/examRecord.entity';
import {
  CompleteExamDto,
  ExamScoreRankDto,
  ProjectDetailDto,
} from '../../dto/examRecord.dto';
import { ExamProject } from '../../entities/examProject.entity';
const dayjs = require('dayjs');

@Injectable()
export class ExamRecordService {
  constructor(
    @InjectRepository(ExamRecord)
    private readonly examRecordRepository: Repository<ExamRecord>,
    private readonly userService: UserService,
    @InjectRepository(ExamProject)
    private readonly examProjectRepository: Repository<ExamProject>,
  ) {}

  async examProject() {
    const examProject = await this.examProjectRepository.find();
    return {
      code: 200,
      result: examProject,
    };
  }

  async projectDetail(body: ProjectDetailDto) {
    const { examProjectId } = body;
    const examProject = await this.examProjectRepository.findOne({
      where: { id: examProjectId },
    });
    return {
      code: 200,
      result: examProject,
    };
  }

  async getExamRecordList() {
    return await this.examRecordRepository.find();
  }

  async completeExam(userId: number, body: CompleteExamDto) {
    const exam_record = this.examRecordRepository.create();
    exam_record.userId = userId;
    exam_record.user = userId;
    exam_record.examProjectId = body.examProjectId;
    exam_record.desc = body.desc;
    exam_record.useTime = body.useTime;
    exam_record.remainTime = body.remainTime;
    exam_record.overTime = body.overTime;
    exam_record.totalScore = body.totalScore;
    await this.examRecordRepository.save(exam_record);
    /**
     * 更新用户考试次数
     */
    const user = await this.userService.getDetailById(userId);
    user.exam_count += 1;
    await this.userService.updateUser({ userId, exam_count: user.exam_count });
    return {
      code: 200,
      result: '考试完成',
    };
  }

  async examStatus(userId: number) {
    const status = await this.userService.getExamStatus(userId);
    return {
      code: 200,
      result: status.data,
    };
  }

  async examScoreRank(userId: number, body: ExamScoreRankDto) {
    const { examProjectId } = body;

    // 获取当前用户在指定考试项目中的最高分数记录
    const userBestRecord = await this.examRecordRepository
      .createQueryBuilder('record')
      .where('record.userId = :userId', { userId })
      .andWhere('record.examProjectId = :examProjectId', { examProjectId })
      .orderBy('record.totalScore', 'DESC')
      .getOne();

    if (!userBestRecord) {
      return {
        code: 200,
        result: {
          bestScore: 0,
          beatPercentage: 0,
          gapToPrev: 0,
          gapToFirst: 0,
        },
      };
    }

    // 获取指定考试项目中所有用户的最高分数记录
    const allUsersBestRecords = await this.examRecordRepository
      .createQueryBuilder('record')
      .select('record.userId', 'userId')
      .addSelect('MAX(record.totalScore)', 'bestScore')
      .where('record.examProjectId = :examProjectId', { examProjectId })
      .groupBy('record.userId')
      .orderBy('bestScore', 'DESC')
      .getRawMany();

    // 计算当前用户排名
    const totalUsers = allUsersBestRecords.length;
    const userRank =
      allUsersBestRecords.findIndex((record) => record.userId === userId) + 1;

    // 计算超越的人数百分比
    const beatPercentage = ((totalUsers - userRank) / totalUsers) * 100;

    // 获取上一名(排名更好)的分数
    const prevRankScore =
      userRank > 1
        ? allUsersBestRecords[userRank - 2].bestScore
        : userBestRecord.totalScore;

    // 获取第一名的分数
    const firstScore = allUsersBestRecords[0].bestScore;

    return {
      code: 200,
      result: {
        bestScore: userBestRecord.totalScore,
        beatPercentage: Math.round(beatPercentage * 100) / 100,
        gapToPrev: userRank > 1 ? prevRankScore - userBestRecord.totalScore : 0,
        prevRankScore,
        gapToFirst: firstScore - userBestRecord.totalScore,
        firstScore,
        rank: userRank,
      },
    };
  }

  async todayExamRecord(userId: number) {
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();
    const record = await this.examRecordRepository.findOne({
      where: { userId, createdTime: Between(todayStart, todayEnd) },
    });
    return {
      code: 200,
      result: record ? true : false,
    };
  }

  async examRecord(userId: number) {
    const record = await this.examRecordRepository.find({
      where: { userId },
    });
    return {
      code: 200,
      result: record,
    };
  }
}
