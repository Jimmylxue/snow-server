import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInService } from './checkIn.service';
import { CheckInController } from './checkIn.controller';
import { CheckInRecord } from '../../entities/checkInRecord.entity';
import { HabitService } from '../habit/habit.service';
import { Habit } from '../../entities/habit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CheckInRecord, Habit])],
  providers: [CheckInService, HabitService],
  controllers: [CheckInController],
})
export class SignInModule {}
