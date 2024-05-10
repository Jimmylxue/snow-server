import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Habit } from '../../entities/habit.entity';
import { HabitService } from './habit.service';
import { HabitController } from './habit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Habit])],
  providers: [HabitService],
  controllers: [HabitController],
})
export class HabitModule {}
