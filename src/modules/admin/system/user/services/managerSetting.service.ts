import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { SaveSettingDto } from '../dto/managerSetting.dto';
import { ManagerSetting } from '../entities/managerSetting.entity';
import { ChildrenRecordService } from './childrenRecord.service';
import { UserService } from './user.service';

@Injectable()
export class ManagerSettingService {
  constructor(
    @InjectRepository(ManagerSetting)
    private readonly managerSettingRepository: Repository<ManagerSetting>,
    private readonly childrenRecordService: ChildrenRecordService,
    private readonly userService: UserService,
  ) {}

  async saveSetting(params: SaveSettingDto, userId: number) {
    if (params.disabledEndHour < params.disabledStartHour) {
      console.log('sajdlkasndjk');
      return {
        code: 500,
        result: '结束时间必须大于开始时间',
      };
    }
    const record = await this.getRecordByUserId(userId);
    if (record?.id) {
      const qb =
        this.managerSettingRepository.createQueryBuilder('managerSetting');
      qb.update(ManagerSetting)
        .set(params)
        .where('managerSetting.id = :recordId', { recordId: record.id })
        .execute();
      return {
        code: 200,
        result: '操作成功',
      };
    } else {
      const setting = await this.managerSettingRepository.create();
      setting.manager = userId;
      setting.managerId = userId;
      setting.disabledStartHour = params.disabledStartHour;
      setting.disabledEndHour = params.disabledEndHour;
      await this.managerSettingRepository.save(setting);
      return {
        code: 200,
        result: '操作成功',
      };
    }
  }

  async getSetting(userId: number) {
    let _userId = userId;
    const isManager = await this.checkIsManager(_userId);
    if (isManager) {
      const record = await this.managerSettingRepository.findOneBy({
        managerId: _userId,
      });
      if (record?.id) {
        return {
          code: 200,
          result: {
            disabledStartHour: record.disabledStartHour,
            disabledEndHour: record.disabledEndHour,
          },
        };
      } else {
        // 默认中午 13点到14点休息
        return {
          code: 200,
          result: {
            disabledStartHour: 13,
            disabledEndHour: 14,
          },
        };
      }
    }

    // 不是管理员 -> 找这个账号的管理员

    const parent = await this.childrenRecordService.getParentByChildrenId(
      _userId,
    );
    if (parent?.parentId) {
      const record = await this.managerSettingRepository.findOneBy({
        managerId: parent.parentId,
      });
      if (record?.id) {
        return {
          code: 200,
          result: {
            disabledStartHour: record.disabledStartHour,
            disabledEndHour: record.disabledEndHour,
          },
        };
      } else {
        // 默认中午 13点到14点休息
        return {
          code: 200,
          result: {
            disabledStartHour: 13,
            disabledEndHour: 14,
          },
        };
      }
    } else {
      return {
        code: 200,
        result: {
          disabledStartHour: 13,
          disabledEndHour: 14,
        },
      };
    }
  }

  async checkIsManager(userId: number) {
    const record = await this.userService.getDetailById(userId);
    return record.role === Role.管理员;
  }

  async getRecordByUserId(managerId: number) {
    return await this.managerSettingRepository.findOneBy({
      managerId,
    });
  }
}
