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
  ChangePasswordDto,
  DelUserDto,
  UpdateMailDto,
  UpdatePhoneDto,
  UserListByPhoneDto,
  UserListDto,
} from '../../dto/update.dto';
import { Role } from '../../entities/user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly bcryptService: BcryptService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { phone, password, noEncrypt } = body;
    let user = await this.usersService.findUserByPhone(phone);
    if (!user) {
      return {
        code: 10000,
        result: '账号或密码错误',
      };
    }
    if (noEncrypt) {
      /**
       * id 为 28是最后一个明文密码用户
       */
      console.log('noEncrypt：', phone);
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

  @Post('login_by_id')
  async loginById(@Body() body: LoginByIdDto) {
    const { id, password, noEncrypt } = body;
    let user = await this.usersService.getDetailById(Number(id));
    if (!user?.id) {
      return {
        code: 10000,
        result: '账号或密码错误',
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

    if (user.role !== Role.管理员) {
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

  @Post('login_by_username')
  async loginByUserName(@Body() body: LoginByUserNameDto) {
    const { username, password, noEncrypt } = body;
    let user = await this.usersService.findUserByPhone(username);
    if (!user) {
      return {
        code: 10000,
        result: '账号或密码错误',
      };
    }
    if (noEncrypt) {
      const compareRes = password === user.password;
      if (compareRes) {
        return await this.usersService.createToken(user);
      }
      return {
        code: 10000,
        result: '账号或密码错误',
      };
    } else {
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

  @Post('login_by_mail')
  async loginByMail(@Body() body: LoginByMailDto) {
    const { code, mail } = body;
    if (!isQQMail(mail)) {
      return { code: 500, result: '邮箱格式验证异常，请校验' };
    }
    let user = await this.usersService.findUserByMail(mail);
    if (!user) {
      return {
        code: 10000,
        result: '该邮箱未创建用户，请检查地址，或为该邮箱注册一个用户',
      };
    }
    const redis = await RedisInstance.initRedis();
    const key = `snow-server-mail-verification-code-${mail}`;
    const redisCode = await redis.get(key);
    if (redisCode !== code.toUpperCase()) {
      return {
        code: 500,
        result: '验证码校验失败，请重新发送验证码进行校验',
      };
    }
    if (redisCode) {
      await redis.del(key);
    }
    return await this.usersService.createToken(user);
  }

  @Post('login_by_mini_program')
  @HttpCode(200)
  async loginByMiniProgram(@Body() body: LoginByMiniProgram) {
    return await this.usersService.miniProgramLogin(body);
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

    // 库中没有这个手机号的用户，或者说是 有这个用户 且邀请人 与 输入的邀请人相同，再加入一条
    const _password = this.usersService.generateUserNameNonceStr();

    await this.usersService.addUser({
      ...params,
      password: _password,
      createTime: Date.now(),
    });

    this.usersService.subAccountCallBack(body.phone);

    if (_user?.inviterPhone) {
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

  @Post('register_by_mail')
  async registerByMail(@Body() body: RegisterByMailDto) {
    // 注册时 传的密码 使用的是 btoa 处理过的密码
    const params = body;
    const { mail } = params;
    if (!isQQMail(mail)) {
      return { code: 500, result: '邮箱格式验证异常，请校验' };
    }
    let res1 = await this.usersService.findUserByMail(body.mail);
    if (res1) {
      return {
        code: 10000,
        result: '该邮箱已被注册',
      };
    }

    const redis = await RedisInstance.initRedis();
    const key = `snow-server-mail-verification-code-${body.mail}`;
    const redisCode = await redis.get(key);
    if (redisCode !== body.code.toUpperCase()) {
      return {
        code: 500,
        result: '验证码校验失败，请重新发送验证码进行校验',
      };
    }

    if (redisCode) {
      await redis.del(key);
    }

    await this.usersService.addUser({
      ...params,
      createTime: Date.now(),
    });

    let user = await this.usersService.findUserByMail(body.mail);

    /** todo-list 项目副作用，用户自动创建基础数据 */
    this.usersService.addUserSuccessHandle(user);

    return await this.usersService.createToken(user);
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
   * 修改密码 - 简单版
   *  只需要校验原密码即可
   */
  @Post('changePassword')
  async changePassword(@Body() body: ChangePasswordDto) {
    return this.usersService.changePassword(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('list_by_phone')
  async userListByPhone(@Body() body: UserListByPhoneDto, @Req() auth) {
    const list = await this.usersService.getUserListByPhone(body);
    return {
      code: 200,
      result: list,
    };
  }
}
