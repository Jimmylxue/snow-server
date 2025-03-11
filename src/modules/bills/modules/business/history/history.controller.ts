import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HistoryService } from './history.service';
import { MonthRecordDTO } from '../dto/history.dto';
@Controller('bill_system/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/month_record')
  async getUserType(@Body() req: MonthRecordDTO, @Req() auth) {
    const { user } = auth;
    const userId = user.userId;
    const result = await this.historyService.getMonthRecord(req, userId);
    return {
      code: 200,
      result,
    };
  }
}
