import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { UserService } from '../../services/user.service';
import {
  GenerateDto,
  RegisterByMailDto,
  RegisterDto,
  UpdateDto,
} from '../../dto/register.dto';
import {
  LoginByIdDto,
  LoginByMailDto,
  LoginByMiniProgram,
  LoginByUserNameDto,
  LoginDto,
} from '../../dto/login.dto';
import { BcryptService } from '../../../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RedisInstance } from '@src/instance';
import { isQQMail } from '@src/utils';
import {
  BResetPassDto,
  BUpdateCodeUrlDto,
  CChangePassDto,
  ChangePassDto,
  ChangePasswordDto,
  DelUserDto,
  UpdateMailDto,
  UpdatePhoneDto,
  UserListByPhoneDto,
  UserListDto,
} from '../../dto/update.dto';
import { AccountType, LoginStatus, Role } from '../../entities/user.entity';
@Controller('user')
export class UserController {
  private queue: (() => Promise<any>)[] = []; // 请求队列
  private isProcessing = false; // 处理状态标志
  constructor(
    private readonly usersService: UserService,
    private readonly bcryptService: BcryptService,
  ) {}

  private async processQueue() {
    if (this.isProcessing) return; // 如果正在处理，则不再处理
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift(); // 从队列中取出请求
      if (request) {
        await request(); // 执行请求
        await this.delay(200); // 等待 500 毫秒
      }
    }

    this.isProcessing = false; // 处理完毕，重置状态
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms)); // 延迟函数
  }

  // @Throttle({ default: { limit: 1, ttl: 1000 } })
  @Post('login_by_id')
  async loginById(@Body() body: LoginByIdDto) {
    return new Promise((resolve) => {
      const requestHandler = async () => {
        const { id, password, noEncrypt } = body;
        let user = await this.usersService.getDetailById(Number(id));
        if (!user?.id) {
          resolve({
            code: 10000,
            result: '账号或密码错误',
          });
          return;
        }
        if (noEncrypt) {
          const compareRes = password === user.password;
          if (!compareRes) {
            resolve({
              code: 10000,
              result: '账号或密码错误~',
            });
            return;
          }

          if (user.loginStatus === LoginStatus.在线) {
            resolve({
              code: 10000,
              result: '账户已登录，请先退出登录',
            });
            return;
          }

          await this.usersService.updateUser({
            userId: user.id,
            loginStatus: LoginStatus.在线,
            lastActive: new Date(),
          });
          const token = await this.usersService.createToken(user);
          resolve(token); // 返回token
          return;
        } else {
          const originUserPassword = atob(user.password).split(
            'snow-todoList',
          )?.[0];
          const compareHashSuccess = await this.bcryptService.compare(
            originUserPassword,
            password,
          );
          if (compareHashSuccess) {
            const token = await this.usersService.createToken(user);
            resolve(token); // 返回token
            return;
          }
          resolve({
            code: 10000,
            result: '账号或密码错误',
          });
          return;
        }
      };

      this.queue.push(requestHandler); // 将请求处理函数添加到队列
      this.processQueue(); // 启动队列处理
    });
  }

  /**
   * 后台登录 管理员不做 心跳检测
   */
  @Post('login_by_admin')
  async loginByAdmin(@Body() body: LoginByIdDto) {
    const { id, password, noEncrypt } = body;
    let user = await this.usersService.getDetailById(Number(id));
    if (!user) {
      return {
        code: 10000,
        result: '账号或密码错误',
      };
    }

    if (![Role.管理员, Role.超级管理员].includes(user.role)) {
      return {
        code: 10000,
        result: '请登录管理员员账号',
      };
    }

    if (noEncrypt) {
      /**
       * id 为 28是最后一个明文密码用户
       */
      const compareRes = password === user.password;
      if (compareRes) {
        return await this.usersService.createToken(user);
      }
      return {
        code: 10000,
        result: '账号或密码错误',
      };
    } else {
      /**
       * id 大于 28 都是 加密密码 使用 atob 获取原密码
       */
      const originUserPassword = atob(user.password).split(
        'snow-todoList',
      )?.[0];
      const compareHashSuccess = await this.bcryptService.compare(
        originUserPassword,
        password,
      );
      if (compareHashSuccess) {
        return await this.usersService.createToken(user);
      }
      return {
        code: 10000,
        result: '账号或密码错误',
      };
    }
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    // 注册时 传的密码 使用的是 btoa 处理过的密码
    const params = body;

    let res1 = await this.usersService.findUserByPhone(body.phone);
    if (res1) {
      return {
        code: 10000,
        result: '该手机号已被注册',
      };
    }

    await this.usersService.addUser({
      ...params,
      createTime: Date.now(),
    });

    let user = await this.usersService.findUserByPhone(body.phone);

    this.usersService.addUserSuccessHandle(user);

    return {
      code: 200,
      result: '注册成功',
    };
  }

  @Post('generate')
  async generates(@Body() body: GenerateDto) {
    // 注册时 传的密码 使用的是 btoa 处理过的密码
    const params = body;

    let _user = await this.usersService.findUserByPhone(body.phone);

    if (_user?.inviterPhone && _user?.inviterPhone !== body.inviterPhone) {
      return {
        code: 10000,
        result: '邀请人信息异常 - 该手机号邀请人与现绑定邀请人不同',
      };
    }

    if (_user?.id && !_user?.inviterPhone && body.inviterPhone) {
      return {
        code: 10000,
        result: '该账号是原始账号，不可绑定邀请人',
      };
    }

    if (!!_user?.codeUrl && body.codeUrl) {
      return {
        code: 10000,
        result: '收款码绑定异常 - 该账号已绑定了收款码，请勿重复绑定',
      };
    }

    if (_user && !_user?.codeUrl && body.codeUrl) {
      await this.usersService.updateUser({
        userId: _user.id,
        codeUrl: body.codeUrl,
      });
    }

    // 库中没有这个手机号的用户，或者说是 有这个用户 且邀请人 与 输入的邀请人相同，再加入一条
    const _password = this.usersService.generateUserNameNonceStr();

    await this.usersService.addUser({
      ...params,
      password: _password,
      createTime: Date.now(),
      codeUrl: body.codeUrl || _user.codeUrl,
    });

    // this.usersService.subAccountCallBack(body.phone);

    if (_user?.inviterPhone && params.accountType === AccountType.自己注册) {
      this.usersService.successInviterCallBack(_user);
    }

    return {
      code: 200,
      result: {
        ...body,
        password: _password,
      },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async userList(@Body() body: UserListDto, @Req() auth) {
    const list = await this.usersService.getUserList(body);
    return {
      code: 200,
      result: list,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  async updateUser(@Body() body: UpdateDto, @Req() auth) {
    // 注册时 传的密码 使用的是 btoa 处理过的密码
    // const  = body;
    const { user } = auth;
    const userId = user.userId;
    const params = body;
    await this.usersService.updateUser({ ...params, userId });
    return {
      code: 200,
      message: '更新成功',
    };
  }

  /**
   * 管理员端使用的更新
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('edit')
  async editUser(@Body() body: UpdateDto, @Req() auth) {
    // 注册时 传的密码 使用的是 btoa 处理过的密码
    // const  = body;
    const params = body;
    await this.usersService.editUser({ ...params });
    return {
      code: 200,
      message: '更新成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('detail')
  async getUserDetail(@Req() auth) {
    // 注册时 传的密码 使用的是 btoa 处理过的密码
    // const  = body;
    const { user } = auth;
    const userId = user.userId;
    const userDetail = await this.usersService.getDetailById(userId);
    return {
      code: 200,
      result: userDetail,
    };
  }

  /**
   * 管理员删除用户
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delLetter(@Body() body: DelUserDto) {
    await this.usersService.delUser(body);
    return {
      code: 200,
      result: '删除成功',
    };
  }

  /**
   * 修改手机号码
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('update_phone')
  async updatePhone(@Body() body: UpdatePhoneDto, @Req() auth) {
    // 注册时 传的密码 使用的是 btoa 处理过的密码
    // const  = body;
    const { user } = auth;
    const userId = user.userId;
    return this.usersService.updateUserPhone(body, userId);
  }

  /**
   * 修改邮箱
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('update_mail')
  async updateMail(@Body() body: UpdateMailDto, @Req() auth) {
    // 注册时 传的密码 使用的是 btoa 处理过的密码
    // const  = body;
    const { user } = auth;
    const userId = user.userId;
    if (body.mail && !isQQMail(body.mail)) {
      return { code: 500, result: '邮箱格式验证异常，请校验' };
    }
    if (!isQQMail(body.newMail)) {
      return { code: 500, result: '邮箱格式验证异常，请校验' };
    }
    const redis = await RedisInstance.initRedis();
    const key = `snow-server-mail-verification-code-${body.newMail}`;
    const redisCode = await redis.get(key);
    if (redisCode) {
      await redis.del(key);
    }
    return this.usersService.updateUserMail(body, userId, redisCode);
  }

  /**
   * quick_app 后台使用的修改账号
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('change_pass')
  async changePass(@Body() body: ChangePassDto) {
    const userId = body.userId;
    const user = await this.usersService.getDetailById(userId);
    if (!user?.id) {
      return {
        code: 500,
        result: '账号异常，请联系管理员',
      };
    }

    await this.usersService.updateUser({ userId, password: body.newPassword });

    return {
      code: 200,
      result: '更新成功',
    };
  }

  /**
   * c 端使用的修改密码
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('c_change_pass')
  async cChangePass(@Body() body: CChangePassDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const _user = await this.usersService.getDetailById(userId);
    if (!_user?.id) {
      return {
        code: 500,
        result: '账号异常，请联系管理员',
      };
    }

    if (_user.password !== body.originPassword) {
      return {
        code: 500,
        result: '密码校验失败，请检查原密码',
      };
    }

    await this.usersService.updateUser({ userId, password: body.newPassword });

    return {
      code: 200,
      result: '更新成功',
    };
  }

  /**
   * 修改密码 - 简单版
   *  只需要校验原密码即可
   */
  @Post('changePassword')
  async changePassword(@Body() body: ChangePasswordDto) {
    return this.usersService.changePassword(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('list_by_phone')
  async userListByPhone(@Body() body: UserListByPhoneDto) {
    const list = await this.usersService.getUserListByPhone(body);
    return {
      code: 200,
      result: list,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('account_info')
  async accountInfo(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const info = await this.usersService.getAccountInfo(userId);
    return {
      code: 200,
      result: info,
    };
  }

  /**
   * 退出登录
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    await this.usersService.updateUser({
      userId,
      loginStatus: LoginStatus.下线,
    });
    return {
      code: 200,
      result: '退出登录成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('heartbeat')
  async heartbeat(@Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    await this.usersService.updateUser({
      userId,
      lastActive: new Date(),
      loginStatus: LoginStatus.在线,
    });
    return {
      code: 200,
      result: '心跳成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('clean_up')
  async clean_up() {
    const res = await this.usersService.cleanUpCheck();
    return {
      code: 200,
      result: res,
    };
  }

  /**
   * b 端 重置密码
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('b_reset_pass')
  async resetPassword(@Body() body: BResetPassDto) {
    const userId = body.userId;
    const _user = await this.usersService.getDetailById(userId);
    if (!_user?.id) {
      return {
        code: 500,
        result: '账号异常，请联系管理员',
      };
    }

    const password =
      body.newPassword || this.usersService.generateUserNameNonceStr();

    await this.usersService.updateUser({ userId, password: password });

    return {
      code: 200,
      result: {
        password,
      },
    };
  }

  /**
   * 更新 手机号级别的 收款码
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('update_code_url')
  async updateCodeUrl(@Body() body: BUpdateCodeUrlDto) {
    const phone = body.phone;
    const _user = await this.usersService.findUserByPhone(phone);
    if (!_user?.id) {
      return {
        code: 500,
        result: '账号异常，请联系管理员',
      };
    }

    await this.usersService.updateCodeUrl(body);

    return {
      code: 200,
      result: '操作成功',
    };
  }
}
