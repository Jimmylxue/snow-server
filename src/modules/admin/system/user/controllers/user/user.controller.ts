import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from '../../services/user.service';
import { RegisterDto, UpdateDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';
import { BcryptService } from '../../../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ChangePasswordDto,
  DelUserDto,
  UpdatePhoneDto,
  UserListDto,
} from '../../dto/update.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly bcryptService: BcryptService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
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

    return {
      code: 200,
      result: '注册成功',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('list')
  async userList(@Body() body: UserListDto) {
    const list = await this.usersService.getUserList(body);
    return {
      code: 200,
      result: list,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  async updateUser(@Body() body: UpdateDto, @Req() auth) {
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
  async editUser(@Body() body: UpdateDto) {
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
    const { user } = auth;
    const userId = user.userId;
    return this.usersService.updateUserPhone(body, userId);
  }

  @Post('changePassword')
  async changePassword(@Body() body: ChangePasswordDto) {
    return this.usersService.changePassword(body);
  }
}
