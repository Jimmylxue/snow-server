import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly taskType: TaskTypeService,
    private readonly configService: ConfigService,
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

  async findUserByMail(mail: string) {
    return await this.userRepository.findOneBy({ mail });
  }

  async getDetailById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async getUserByOpenId(openid: string) {
    return await this.userRepository.findOneBy({ openid });
  }

  async getUserCoin(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user.coin;
  }

  async updateUserCoin(userId: number, coin: number) {
    await this.userRepository.update(userId, { coin });
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

  /**
   * 修改邮箱
   */
  async updateUserMail(
    params: UpdateMailDto,
    userId: number,
    redisCode: string,
  ) {
    const loginUserInfo = await this.getDetailById(userId);
    if (loginUserInfo?.mail && loginUserInfo.mail !== params.mail) {
      return {
        code: 500,
        result: '您的邮箱有误',
      };
    }
    const user = await this.findUserByMail(params.newMail);
    if (user) {
      return {
        code: 500,
        result: '更改的邮箱已被注册',
      };
    }
    if (redisCode !== params.code) {
      return {
        code: 500,
        result: '验证码校验失败',
      };
    }
    await this.updateUser({ mail: params.newMail, userId });
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

  async miniProgramLogin(body: LoginByMiniProgram) {
    const appID = this.configService.get('WX_MINI_PROGRAM_APPID');
    const AppSecret = this.configService.get('WX_MINI_PROGRAM_APPSECRET');
    const { code, ...userInfo } = body;
    const res = await this.httpService.axiosRef.get<{
      openid: string;
      session_key: string;
    }>(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${appID}&secret=${AppSecret}&js_code=${code}&grant_type=authorization_code`,
    );
    if (res.status === 200 && res.data.openid) {
      /**
       * 判断是否是系统内用户
       *  如果是 -> 返回用户信息
       *  如果不是 -> 根据openid 注册一个
       */
      const checkUser = await this.getUserByOpenId(res.data.openid);
      if (checkUser?.id) {
        return await this.createToken(checkUser);
      } else {
        const lastData = await this.getLastData();
        await this.addUser({
          ...userInfo,
          openid: res.data.openid,
          createTime: Date.now(),
          username: userInfo.username || `游客${lastData.id + 1}`,
        });
        let user = await this.getUserByOpenId(res.data.openid);
        this.addUserSuccessHandle(user);
        return await this.createToken(user);
      }
    }
  }

  /**
   * 获取表中最后一条数据
   */
  async getLastData() {
    const qb = this.userRepository.createQueryBuilder('user');
    return await qb.orderBy('user.id', 'DESC').getOne();
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
   * 注册成功后副作用
   * @param user
   */
  addUserSuccessHandle(user: User) {
    const registerUserId = user.id;

    this.taskType.addUserTaskType({
      userId: registerUserId,
      typeName: '工作',
      createTime: Date.now() + '',
    });
  }

  generateUserNameNonceStr() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nonceStr = '';
    for (let i = 0; i < 8; i++) {
      nonceStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return nonceStr;
  }
}
