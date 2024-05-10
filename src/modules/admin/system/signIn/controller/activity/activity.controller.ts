import { Controller, Get, Post } from '@nestjs/common';
import { SystemException } from '@src/exception';
import { ActivityService } from '../../services/activity/activity.service';
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('/list')
  async getBaseInfo() {
    const { data } = await this.activityService.getActivityList();
    if (data.code === '200') {
      return {
        code: 200,
        result: data,
      };
    }
    throw new SystemException('THIRD_PART_SERVICE_ERROR_CODE', 200, '');
  }

  @Get('/detail')
  async getDetail() {
    const { data } = await this.activityService.getActivityList();
    if (data.code === '200') {
      return {
        code: 200,
        result: data,
      };
    }
    throw new SystemException('THIRD_PART_SERVICE_ERROR_CODE', 200, '');
  }

  @Post('/add')
  async addItem() {
    const { data } = await this.activityService.getActivityList();
    if (data.code === '200') {
      return {
        code: 200,
        result: data,
      };
    }
    throw new SystemException('THIRD_PART_SERVICE_ERROR_CODE', 200, '');
  }

  @Post('/delete')
  async delItem() {
    const { data } = await this.activityService.getActivityList();
    if (data.code === '200') {
      return {
        code: 200,
        result: data,
      };
    }
    throw new SystemException('THIRD_PART_SERVICE_ERROR_CODE', 200, '');
  }
}
