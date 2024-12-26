import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountType, Level, LoginStatus, User } from '../entities/user.entity';
import { Between, LessThan, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  BUpdateCodeUrlDto,
  ChangePasswordDto,
  DelUserDto,
  UpdateMailDto,
  UpdatePhoneDto,
  UserListByPhoneDto,
  UserListDto,
} from '../dto/update.dto';
import { LoginByMiniProgram } from '../dto/login.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BcryptService } from '../../auth/auth.service';
import { SendLetterService } from '../../siteLetter/sendLetter/sendLetter.service';
import { EPlatform } from '../../siteLetter/entities/letter.entity';
import { LoggerService } from '@src/modules/shared/service/Logger.service';
import { PhoneCoin } from '../../coinRecord/entities/phoneCoin.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PhoneCoin)
    private readonly phoneCoinRepository: Repository<PhoneCoin>,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly sendLetterService: SendLetterService,
    private readonly bcryptService: BcryptService,
    @Inject(LoggerService) private readonly logger: LoggerService,
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
    console.log('颁发token', token);
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
  }

  generateUserNameNonceStr() {
    const chars = '0123456789';
    let nonceStr = '';
    for (let i = 0; i < 8; i++) {
      nonceStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return nonceStr.slice(0, 6);
  }

  /**
   * 新增一个账户之后，将这个账户的下的 前一个账号解锁
   */
  async subAccountCallBack(phone: string) {
    const ids = await this.userRepository.find({
      select: ['id'],
      where: {
        level: Level.新人,
        phone: phone,
      },
    });
    if (ids?.length === 2) {
      const updateId = ids[0].id;
      await this.updateUser({ level: Level.专职, userId: updateId });
    }
  }

  /**
   * 账号生成成功之后的 对邀请人 的 副作用
   */
  async successInviterCallBack(user: User) {
    const [result, total] = await this.userRepository.findAndCount({
      select: ['id'],
      where: {
        phone: user.phone,
        accountType: AccountType.自己注册,
      },
    });

    const registerPhoneCount = result.length;

    /**
     * 是否 是 10 的倍数
     */
    const isFullPlusOne = registerPhoneCount % 10 === 0;
    if (isFullPlusOne) {
      const superManagerPhone = '13344445555';
      const managerPhone = '14455556666';
      await this.sendLetterService.sendQuickLetterToPhone({
        title: '条件达成通知',
        // content: `手机号：${user.phone}已达成邀请${total}个账号成就，${user.inviterPhone}额外获得一个账号`,
        content: `手机号：${user.phone}已达成满10送1，${user.inviterPhone}额外获得一个账号`,
        platform: EPlatform.系统消息,
        phones: [superManagerPhone, managerPhone, user.inviterPhone],
      });
    }
  }

  /**
   * 旧版本 没有返回具体children里面的内容  性能会高一点 如果后续性能跟不上就用这个
   *  具体下面的内容就再调用一次接口获取children
   */
  async getUserListByPhoneV1(body: UserListByPhoneDto) {
    const { page, pageSize, ...where } = body;
    // 获取分组后的结果
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select('user.phone, COUNT(user.id) as count')
      .where(where)
      .groupBy('user.phone')
      .orderBy('user.phone', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getRawMany();

    // 获取总的不同 phone 的数量
    const total = await this.userRepository
      .createQueryBuilder('user')
      .select('COUNT(DISTINCT user.phone)', 'count')
      .where(where)
      .getRawOne();

    return {
      page: page,
      result: result.map((item) => ({
        phone: item.phone,
        count: parseInt(item.count, 10), // 转换为整数
      })),
      total: total.count,
    };
  }

  async getUserListByPhone(body: UserListByPhoneDto) {
    const { page, pageSize, ...where } = body;
    // 获取分组后的结果
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select(
        'user.phone, COUNT(user.id) as count, COUNT(CASE WHEN user.accountType = 2 THEN 1 END) as accountType2Count,COUNT(CASE WHEN user.loginStatus = 2 THEN 1 END) as loginStatus2Count,(SELECT COUNT(*) FROM user u WHERE u.inviterPhone = user.phone) as inviterCount',
      )
      .where(where)
      .groupBy('user.phone')
      .orderBy('user.phone', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getRawMany();

    // 获取每个 phone 对应的实际用户数据
    const phones = result.map((item) => item.phone);
    const childrenData = await this.userRepository
      .createQueryBuilder('user')
      .where('user.phone IN (:...phones)', { phones })
      .getMany();

    const phoneCoins = await this.phoneCoinRepository
      .createQueryBuilder('phoneCoin')
      .where('phoneCoin.phone IN (:...phones)', { phones })
      .getMany();

    // 将结果格式化为需要的结构
    const formattedResult = result.map((item) => {
      const coinData = phoneCoins.find((coin) => coin.phone === item.phone);
      return {
        phone: item.phone,
        count: parseInt(item.count), // 转换为整数
        sendAccountCount: parseInt(item.accountType2Count, 10),
        inviterCount: parseInt(item.inviterCount, 10),
        coin: coinData ? coinData.coin : 0, // 如果没有找到对应的 coin，默认为 0
        children: childrenData.filter((child) => child.phone === item.phone), // 过滤出对应的用户数据
      };
    });

    // 获取总的不同 phone 的数量
    const total = await this.userRepository
      .createQueryBuilder('user')
      .select('COUNT(DISTINCT user.phone)', 'count')
      .addSelect(
        'COUNT(CASE WHEN user.loginStatus = 2 THEN 1 END)',
        'loginStatus2Count',
      )
      .addSelect(
        'COUNT(DISTINCT CASE WHEN user.loginStatus = 2 THEN user.phone END)',
        'phoneLoginStatus2Count',
      )
      .addSelect('COUNT(*)', 'subAccountTotal')
      .where(where)
      .getRawOne();

    return {
      page: page,
      result: formattedResult,
      total: total.count,
      subAccountTotal: total.subAccountTotal,
      loginTotal: total.loginStatus2Count,
      phoneLoginTotal: total.phoneLoginStatus2Count,
    };
  }

  /**
   * 获取所有的手机号集合
   */
  async getPhoneList() {
    // 获取分组后的结果
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select('user.phone, COUNT(user.id) as count')
      .groupBy('user.phone')
      .orderBy('user.phone', 'DESC')
      .getRawMany();

    // 获取每个 phone 对应的实际用户数据
    const phones = result.map((item) => item.phone);

    return { phones };
  }

  async getAccountInfo(id: number) {
    const user = await this.getDetailById(id);
    const phone = user.phone;
    const list = await this.userRepository.find({
      where: {
        phone,
      },
    });
    const sendCount = list.filter(
      (item) => item.accountType === AccountType.满赠,
    ).length;
    const registerCount = list.length - sendCount;
    return {
      sendCount,
      registerCount,
    };
  }

  async cleanUpCheck() {
    // const inactiveDuration = 30 * 60 * 1000;
    const inactiveDuration = 20 * 1000;
    const now = new Date();

    const inactiveUsers = await this.userRepository.find({
      where: {
        loginStatus: LoginStatus.在线,
        lastActive: LessThan(new Date(now.getTime() - inactiveDuration)),
      },
    });

    for (const user of inactiveUsers) {
      user.loginStatus = LoginStatus.下线;
      await this.userRepository.save(user);
    }

    this.logger.log(`清理了 ${inactiveUsers.length} 个长时间未活动用户`);

    return `清理了 ${inactiveUsers.length} 个长时间未活动用户`;
  }

  async updateCodeUrl(params: BUpdateCodeUrlDto) {
    await this.userRepository.update(
      {
        phone: params.phone,
      },
      {
        codeUrl: params.codeUrl,
      },
    );
  }

  sleep(time: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, time);
    });
  }
}
