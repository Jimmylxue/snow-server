import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { GenerateDto, RegisterDto, UpdateDto } from '../../dto/register.dto';
import { LoginByMiniProgram, LoginByWxOfficial } from '../../dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto, DelUserDto } from '../../dto/update.dto';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('login_by_mini_program')
  @HttpCode(200)
  async loginByMiniProgram(@Body() body: LoginByMiniProgram) {
    const res = await this.usersService.miniProgramLogin(body);
    return res;
  }

  @Post('login_by_wx_official')
  @HttpCode(200)
  async loginByWxOfficial(@Body() body: LoginByWxOfficial) {
    const res = await this.usersService.wxOfficialLogin(body);
    return res;
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    // 注册时 传的密码 使用的是 btoa 处理过的密码
    const params = body;

    const res1 = await this.usersService.findUserByPhone(body.phone);
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

    const user = await this.usersService.findUserByPhone(body.phone);

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

    const res1 = await this.usersService.findUserByPhone(body.phone);
    if (res1) {
      return {
        code: 10000,
        result: '该手机号已被注册',
      };
    }

    const _password = this.usersService.generateUserNameNonceStr();

    await this.usersService.addUser({
      ...params,
      password: _password,
      createTime: Date.now(),
    });

    const user = await this.usersService.findUserByPhone(body.phone);

    this.usersService.addUserSuccessHandle(user);

    return {
      code: 200,
      result: {
        ...body,
        password: _password,
      },
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
   * 修改密码 - 简单版
   *  只需要校验原密码即可
   */
  @Post('changePassword')
  async changePassword(@Body() body: ChangePasswordDto) {
    return this.usersService.changePassword(body);
  }
}
