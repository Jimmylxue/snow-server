import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Between, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  ChangePasswordDto,
  DelUserDto,
  UpdatePhoneDto,
  UserListDto,
} from '../dto/update.dto';
import { BcryptService } from '../../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findAllId(): Promise<number[]> {
    const ids = await this.userRepository.find({
      select: ['id'],
    });
    return ids.map((item) => item.id);
  }

  addUser(params) {
    // this.userRepository.createQueryBuilder().ins
    return this.userRepository.insert(params);
  }

  async findUserByUserName(username: string) {
    return await this.userRepository.findOneBy({ username });
  }

  async findUserByPhone(phone: string) {
    return await this.userRepository.findOneBy({ phone });
  }

  async getDetailById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async getUserList(body: UserListDto) {
    const { page, pageSize, startTime, endTime, ...where } = body;
    const [result, total] = await this.userRepository.findAndCount({
      where: {
        ...where,
        createTime: startTime ? Between(startTime, endTime) : undefined,
      },
      order: {
        id: 'DESC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      page: page,
      result,
      total,
    };
  }

  async updateUser(updateParams: any) {
    const { userId, ...params } = updateParams;
    const qb = this.userRepository.createQueryBuilder('user');
    qb.update(User)
      .set(params)
      .where('user.id = :userId', { userId })
      .execute();
    return { status: 1, message: '更新成功' };
  }

  async editUser(updateParams: any) {
    const { id: userId, ...params } = updateParams;
    const qb = this.userRepository.createQueryBuilder('user');
    qb.update(User)
      .set(params)
      .where('user.id = :userId', { userId })
      .execute();
    return { status: 1, message: '更新成功' };
  }

  async delUser(body: DelUserDto) {
    return await this.userRepository.delete({ id: body.id });
  }

  /**
   * 修改手机号码
   */
  async updateUserPhone(params: UpdatePhoneDto, userId: number) {
    const loginUserInfo = await this.getDetailById(userId);
    if (loginUserInfo.phone && loginUserInfo.phone !== params.phone) {
      return {
        code: 500,
        result: '您的手机号错误',
      };
    }
    const user = await this.findUserByPhone(params.newPhone);
    if (user) {
      return {
        code: 500,
        result: '更改的手机号已被注册',
      };
    }
    await this.updateUser({ phone: params.newPhone, userId });
    return {
      code: 200,
      result: '操作成功',
    };
  }

  async createToken(user) {
    const payload = {
      username: user.username,
      userId: user.id,
      avatar: user.avatar,
      role: user.role,
    };
    delete user.password;
    delete user.openid;
    const token = await this.jwtService.sign(payload);
    console.log('token~', token);
    return {
      msg: '登录成功',
      code: 200,
      result: {
        user: user,
        //得到token
        token,
      },
    };
  }

  /**
   * 修改密码
   */
  async changePassword(body: ChangePasswordDto) {
    const { phone, originPassword, newPassword } = body;
    const user = await this.findUserByPhone(phone);
    if (!user) {
      return {
        code: 10000,
        result: '账号不存在，请重新输入',
      };
    }
    const originUserPassword = atob(user.password).split('snow-todoList')?.[0];
    const compareHashSuccess = await this.bcryptService.compare(
      originUserPassword,
      originPassword,
    );
    if (!compareHashSuccess) {
      return {
        code: 10000,
        result: '账号或密码错误',
      };
    }
    await this.updateUser({ userId: user.id, password: newPassword });
    return {
      code: 200,
      message: '更新成功',
    };
  }

  /**
   * 同时要 获取 所有用户的 的 studyTime 的值，
   * 返回用户这个用户id的
   * 学习时间、超越人数百分比、与上名考生的时间差距，以及与第一名考生的差距。
   */
  async getStudyStatus(userId: number) {
    // 获取所有用户的学习时间，并按学习时间降序排序
    const users = await this.userRepository.find({
      select: ['id', 'studyTime'],
      order: {
        studyTime: 'DESC',
      },
    });

    // 找到当前用户的信息和排名
    const currentUserIndex = users.findIndex((user) => user.id === userId);
    if (currentUserIndex === -1) {
      return {
        code: 404,
        message: '未找到用户信息',
      };
    }

    const currentUser = users[currentUserIndex];
    const totalUsers = users.length;
    const userRank = currentUserIndex + 1;

    // 计算超越的人数百分比
    const exceedPercentage = (
      ((totalUsers - userRank) / totalUsers) *
      100
    ).toFixed(2);

    // 计算与上一名的差距
    const gapWithPrev =
      currentUserIndex > 0
        ? users[currentUserIndex - 1].studyTime - currentUser.studyTime
        : 0;

    // 计算与第一名的差距
    const gapWithFirst = users[0].studyTime - currentUser.studyTime;

    return {
      code: 200,
      data: {
        studyTime: currentUser.studyTime,
        rank: userRank,
        exceedPercentage: `${exceedPercentage}%`,
        gapWithPrev: currentUserIndex === 0 ? '已经是第一名' : gapWithPrev,
        gapWithFirst: currentUserIndex === 0 ? 0 : gapWithFirst,
        totalUsers,
      },
    };
  }

  /**
   * 同时要 获取 所有用户的 的 exam 的值，
   * 返回用户这个用户id的
   * 学习时间、超越人数百分比、与上名考生的时间差距，以及与第一名考生的差距。
   */
  async getExamStatus(userId: number) {
    // 获取所有用户的学习时间，并按学习时间降序排序
    const users = await this.userRepository.find({
      select: ['id', 'exam_count'],
      order: {
        exam_count: 'DESC',
      },
    });

    // 找到当前用户的信息和排名
    const currentUserIndex = users.findIndex((user) => user.id === userId);
    if (currentUserIndex === -1) {
      return {
        code: 404,
        message: '未找到用户信息',
      };
    }

    const currentUser = users[currentUserIndex];
    const totalUsers = users.length;
    const userRank = currentUserIndex + 1;

    // 计算超越的人数百分比
    const exceedPercentage = (
      ((totalUsers - userRank) / totalUsers) *
      100
    ).toFixed(2);

    // 计算与上一名的差距
    const gapWithPrev =
      currentUserIndex > 0
        ? users[currentUserIndex - 1].exam_count - currentUser.exam_count
        : 0;

    // 计算与第一名的差距
    const gapWithFirst = users[0].exam_count - currentUser.exam_count;

    return {
      code: 200,
      data: {
        exam_count: currentUser.exam_count,
        rank: userRank,
        exceedPercentage: `${exceedPercentage}%`,
        gapWithPrev: currentUserIndex === 0 ? '已经是第一名' : gapWithPrev,
        gapWithFirst: currentUserIndex === 0 ? 0 : gapWithFirst,
        totalUsers,
      },
    };
  }
}
