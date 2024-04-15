import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { RegisterDto, UpdateDto } from '../../dto/register.dto';
import { LoginByMiniProgram, LoginDto } from '../../dto/login.dto';
import { BcryptService } from '../../../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePhoneDto } from '../../dto/update.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly bcryptService: BcryptService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { phone, password } = body;
    let user = await this.usersService.findUserByPhone(phone);
    if (!user) {
      return {
        code: 10000,
        result: '账号或密码错误',
      };
    }

    const originUserPassword = atob(user.password).split('snow-todoList')?.[0];
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
}
