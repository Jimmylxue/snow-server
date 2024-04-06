import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { HabitService } from './habit.service';
import { AuthGuard } from '@nestjs/passport';
import {
  AddHabitDto,
  DelHabitDto,
  HabitListDto,
  UpdateHabitDto,
  UpdateHabitStatusDto,
} from '../../dto/habit.dto';

@Controller('habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/list')
  async getList(@Body() body: HabitListDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const records = await this.habitService.getUserHabit(body, userId);
    return {
      code: 200,
      result: records,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/add')
  async addHabit(@Body() body: AddHabitDto, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const letter = await this.habitService.addHabit(body, userId);
    return {
      code: 200,
      result: letter,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async updateLetter(@Body() body: UpdateHabitDto) {
    const letter = await this.habitService.updateLetter(body);
    if (letter) {
      return {
        code: 200,
        result: '更新成功',
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/updateStatus')
  async updateStatus(@Body() body: UpdateHabitStatusDto) {
    const letter = await this.habitService.updateLetter(body);
    if (letter) {
      return {
        code: 200,
        result: '更新成功',
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/del')
  async delLetter(@Body() body: DelHabitDto) {
    const res = await this.habitService.delLetter(body);
    if (res.affected === 0) {
      return {
        code: 500,
        result: '检查删除内容是否存在',
      };
    }
    return {
      code: 200,
      result: '删除成功',
    };
  }
}
