import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from '../entities/user.entity';
import { Between, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  ChangePasswordDto,
  DelUserDto,
  UpdateMailDto,
  UpdatePhoneDto,
  UserListDto,
} from '../dto/update.dto';
import { LoginByMiniProgram } from '../dto/login.dto';
import { HttpService } from '@nestjs/axios';
import { TaskTypeService } from '@src/modules/todolist/modules/taskType/taskType.service';
import { ConfigService } from '@nestjs/config';
import { BcryptService } from '../../auth/auth.service';
import { UserGeoRecord } from '../entities/geoRecord.entity';
import { AddGeoRecordDto, GeoRecordListDto } from '../dto/geo.dto';
import { LocationService } from '../../resource/services/gaodeMap/location.service';
import { ChildrenRecord } from '../entities/childrenRecord.entity';
import { AddRecordDto, RemoveRecordDto } from '../dto/childrenRecord.dto';
import { UserService } from './user.service';

@Injectable()
export class ChildrenRecordService {
  constructor(
    @InjectRepository(ChildrenRecord)
    private readonly childrenRecordRepository: Repository<ChildrenRecord>,
    private readonly userService: UserService,
  ) {}

  async addRecord(params: AddRecordDto, userId: number) {
    const child = await this.userService.findUserByPhone(params.phone);
    if (!child?.id) {
      return {
        code: 500,
        result: '请检查手机号是否存在',
      };
    }

    if (child.role === Role.管理员) {
      return {
        code: 500,
        result: '该账号不是孩子账号，不能绑定',
      };
    }

    console.log('userId', userId, child.id);
    const checkChildren = await this.getChildrenById(child.id);
    if (checkChildren?.id) {
      return {
        code: 500,
        result: '该账号已经被绑定',
      };
    }
    const record = this.childrenRecordRepository.create();
    record.parentId = userId;
    record.parent = userId;
    record.childrenId = child.id;
    record.children = child.id;
    await this.childrenRecordRepository.save(record);
    return {
      code: 200,
      result: '操作成功',
    };
  }

  async removeRecord(params: RemoveRecordDto, userId: number) {
    const checkChildren = await this.getChildrenById(params.childrenId);
    if (checkChildren.id) {
      await this.childrenRecordRepository.delete({ id: checkChildren.id });
      return {
        code: 200,
        result: '解绑成功',
      };
    } else {
      return {
        code: 200,
        result: '该账号并没有被绑定',
      };
    }
  }

  async getChildrenById(childrenId: number) {
    return await this.childrenRecordRepository.findOneBy({
      childrenId,
    });
  }

  async getAllList(userId: number) {
    return await this.childrenRecordRepository.find({
      // select: ['recordId', 'letter', 'status', 'createdTime'],
      relations: {
        children: true,
      },
      where: {
        parentId: userId,
        // clubMemberId: userId,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getParent(userId: number) {
    const record = await this.getParentByChildrenId(userId);
    let parent: any;
    if (record?.parentId) {
      parent = await this.userService.getDetailById(record.parentId);
    }
    return {
      code: 200,
      result: parent,
    };
  }

  async getParentByChildrenId(childrenId: number) {
    return await this.childrenRecordRepository.findOneBy({
      childrenId,
    });
  }
}
