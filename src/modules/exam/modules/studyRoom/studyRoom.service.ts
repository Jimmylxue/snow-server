import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Repository } from 'typeorm';
import { EStudyRoomType, StudyRoom } from '../../entities/studyRoom.entity';
import { StudyRoomRecord } from '../../entities/studyRecord.entity';
import { JoinStudyRoomDto } from '../../dto/studyRoom.dto';
import { UserService } from '@src/modules/admin/system/user/services/user.service';
import { Cron } from '@nestjs/schedule';
const dayjs = require('dayjs');

@Injectable()
export class StudyRoomService {
  constructor(
    @InjectRepository(StudyRoom)
    private readonly studyRoomRepository: Repository<StudyRoom>,
    @InjectRepository(StudyRoomRecord)
    private readonly studyRoomRecordRepository: Repository<StudyRoomRecord>,
    private readonly userService: UserService,
  ) {}

  async getRoomList() {
    return await this.studyRoomRepository.find();
  }

  async joinStudyRoom(userId: number, body: JoinStudyRoomDto) {
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();
    const room = await this.studyRoomRepository.findOne({
      where: {
        id: body.studyRoomId,
      },
    });
    const record = await this.studyRoomRecordRepository.findOne({
      where: {
        userId,
        createdTime: Between(todayStart, todayEnd),
        endTime: IsNull(),
      },
    });
    if (record) {
      record.studyTime = dayjs().toDate();
      await this.studyRoomRecordRepository.update(record.id, {
        studyTime: dayjs().toDate(),
      });
      return {
        code: 200,
        result: '更新加入时间',
      };
    }

    if (
      room.studyRoomType === EStudyRoomType.统一自习模式 &&
      (dayjs().hour() < room.openTime || dayjs().hour() > room.closeTime)
    ) {
      throw new Error('自习室已关闭，明日再来');
    }
    const study_record = this.studyRoomRecordRepository.create();
    study_record.userId = userId;
    study_record.user = userId;
    study_record.studyRoomId = body.studyRoomId;
    study_record.studyTime = dayjs().toDate();
    await this.studyRoomRecordRepository.save(study_record);
    return {
      code: 200,
      result: '加入学习室成功',
    };
  }

  async exitStudyRoom(userId: number, studyRoomId: number) {
    const record = await this.studyRoomRecordRepository.findOne({
      where: {
        userId,
        studyRoomId,
        endTime: IsNull(),
      },
    });
    if (!record) {
      return {
        code: 200,
        result: '您未加入学习室',
      };
    }
    if (record) {
      record.endTime = dayjs().toDate();
      await this.studyRoomRecordRepository.save(record);
      /**
       * 获取开始时间 到 结束之间 的分钟数
       */
      const studyTime = dayjs(record.endTime).diff(
        dayjs(record.studyTime),
        'minutes',
      );

      /**
       * 更新用户的学习时间
       */
      const user = await this.userService.getDetailById(userId);
      user.studyTime += studyTime;
      await this.userService.updateUser(user);

      return {
        code: 200,
        result: '退出学习室成功',
      };
    }
  }

  async studyRoomDetail(studyRoomId: number) {
    const room = await this.studyRoomRepository.findOne({
      where: { id: studyRoomId },
    });
    return {
      code: 200,
      result: room,
    };
  }

  async studyStatus(userId: number) {
    const status = await this.userService.getStudyStatus(userId);
    return {
      code: 200,
      result: status.data,
    };
  }

  async todayStudyRecord(userId: number) {
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();
    const record = await this.studyRoomRecordRepository.findOne({
      where: { userId, endTime: Between(todayStart, todayEnd) },
    });
    return {
      code: 200,
      result: record ? true : false,
    };
  }

  async studyRecord(userId: number) {
    const record = await this.studyRoomRecordRepository.find({
      where: { userId },
    });
    return {
      code: 200,
      result: record,
    };
  }

  async getStudyRoomUserCount(studyRoomId: number) {
    const count = await this.studyRoomRecordRepository.count({
      where: { studyRoomId, endTime: IsNull() },
    });
    return {
      code: 200,
      result: count,
    };
  }

  /**
   * 每天的下午 18:00 定时删除 没有 endTime 的学习记录
   */
  @Cron('0 0 18 * * *')
  async deleteStudyRecord() {
    await this.studyRoomRecordRepository.delete({
      endTime: IsNull(),
      studyRoomId: 2,
    });
  }
}
