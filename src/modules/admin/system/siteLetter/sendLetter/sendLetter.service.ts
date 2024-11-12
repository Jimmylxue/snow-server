import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SendRecord } from '../entities/sendRecord.entity';
import { Repository } from 'typeorm';
import {
  recordListDto,
  recordUserDto,
  userReadDto,
  userRecordDto,
} from '../dto/send.dto';

@Injectable()
export class SendLetterService {
  constructor(
    @InjectRepository(SendRecord)
    private readonly sendRecordRepository: Repository<SendRecord>,
  ) {}

  async sendLetter(letterId: number) {
    const record = this.sendRecordRepository.create();
    record.letterId = letterId;
    record.sendUserId = 1;
    record.recordUser = 1;
    return await this.sendRecordRepository.save(record);
  }

  async sendToSome(letterId: number, userIds: number[]) {
    const data = userIds.map((sendUserId) => ({
      letterId,
      sendUserId,
      recordUser: sendUserId,
    }));
    return await this.sendRecordRepository.insert(data);
  }

  async sendToAll(letterId: number, userIds: number[]) {
    const data = userIds.map((sendUserId) => ({
      letterId,
      sendUserId,
      recordUser: sendUserId,
    }));
    return await this.sendRecordRepository.insert(data);
  }

  async getRecordList(body: recordListDto) {
    return await this.sendRecordRepository.find({
      relations: {
        // @ts-ignore
        recordUser: true,
      },
      where: body,
    });
  }

  async getRecordUser(body: recordUserDto) {
    const records = await this.getRecordList(body);
    const userList = records.map((record) => record.recordUser);
    return userList;
  }

  async getUserLetter(body: userRecordDto, userId: number) {
    return await this.sendRecordRepository.find({
      select: ['recordId', 'letter', 'status', 'createdTime'],
      relations: {
        letter: true,
      },
      where: {
        status: body.status,
        sendUserId: userId,
      },
      order: {
        recordId: 'DESC',
      },
    });
  }

  async updateRecord(body: userReadDto) {
    const { recordId, ...params } = body;
    const qb = this.sendRecordRepository.createQueryBuilder('sendRecord');
    return await qb
      .update(SendRecord)
      .set(params)
      .where('sendRecord.recordId = :recordId', { recordId })
      .execute();
  }
}
