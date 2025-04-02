import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { UserService } from '@src/modules/admin/system/user/services/user.service';
import { ExamRecord } from '../../entities/examRecord.entity';
import { CompleteExamDto } from '../../dto/examRecord.dto';
const dayjs = require('dayjs');

@Injectable()
export class ExamRecordService {
  constructor(
    @InjectRepository(ExamRecord)
    private readonly examRecordRepository: Repository<ExamRecord>,
    private readonly userService: UserService,
  ) {}

  async getExamRecordList() {
    return await this.examRecordRepository.find();
  }

  async completeExam(userId: number, body: CompleteExamDto) {
    const exam_record = this.examRecordRepository.create();
    exam_record.userId = userId;
    exam_record.user = userId;
    exam_record.examType = body.examType;
    exam_record.desc = body.desc;
    exam_record.useTime = body.useTime;
    exam_record.remainTime = body.remainTime;
    exam_record.overTime = body.overTime;
    await this.examRecordRepository.save(exam_record);
    /**
     * 更新用户考试次数
     */
    const user = await this.userService.getDetailById(userId);
    user.exam_count += 1;
    await this.userService.updateUser(user);
    return {
      code: 200,
      result: '考试完成',
    };
  }

  async examStatus(userId: number) {
    const status = await this.userService.getStudyStatus(userId);
    return {
      code: 200,
      result: status,
    };
  }

  async todayExamRecord(userId: number) {
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();
    const record = await this.examRecordRepository.findOne({
      where: { userId, createdTime: Between(todayStart, todayEnd) },
    });
    console.log(record);
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
