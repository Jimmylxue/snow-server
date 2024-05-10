import { Module } from '@nestjs/common';
import { HabitModule } from './modules/habit/habit.module';
import { SignInModule } from './modules/checkIn/checkIn.module';

@Module({
  imports: [HabitModule, SignInModule],
  providers: [],
  controllers: [],
})
export class CheckInModule {}
