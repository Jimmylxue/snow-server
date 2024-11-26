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
import { LetterService } from '../letter/letter.service';

@Injectable()
export class SendLetterService {
  constructor(
    @InjectRepository(SendRecord)
    private readonly sendRecordRepository: Repository<SendRecord>,
    private readonly letterService: LetterService,
  ) {}

  async sendLetter(letterId: number) {
    const record = this.sendRecordRepository.create();
    record.letterId = letterId;
    // record.sendUserId = 1;
    // record.recordUser = 1;
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
      where: body,
    });
  }

  // async getRecordUser(body: recordUserDto) {
  //   const records = await this.getRecordList(body);
  //   const userList = records.map((record) => record.recordUser);
  //   return userList;
  // }

  async getUserLetter(body: userRecordDto, phone: string) {
    return await this.sendRecordRepository.find({
      select: ['recordId', 'letter', 'status', 'createdTime'],
      relations: {
        letter: true,
      },
      where: {
        status: body.status,
        sendPhone: phone,
        letter: {
          platform: body.platform,
        },
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

  async sendToPhone(letterId: number, phones: string[]) {
    const data = phones.map((sendPhone) => ({
      letterId,
      sendPhone,
    }));
    return await this.sendRecordRepository.insert(data);
  }

  /**
   * 发送快速消息
   */
  async sendQuickLetterToPhone({ title, content, phones, platform }) {
    const letter = await this.letterService.addLetter({
      content,
      title,
      platform,
    });
    await this.sendToPhone(letter.letterId, phones);
  }
}
