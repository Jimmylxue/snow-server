import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Habit } from '../../entities/habit.entity';
import { Repository } from 'typeorm';
import {
  AddHabitDto,
  DelHabitDto,
  HabitListDto,
  UpdateHabitDto,
  UpdateHabitStatusDto,
} from '../../dto/habit.dto';

@Injectable()
export class HabitService {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: Repository<Habit>,
  ) {}

  async getUserHabit(body: HabitListDto, userId: number) {
    return await this.habitRepository.find({
      // select: ['recordId', 'letter', 'status', 'createdTime'],
      // relations: {
      //   letter: true,
      // },
      where: {
        ...body,
        user: userId,
      },
      order: {
        habitId: 'DESC',
      },
    });
  }

  async addHabit(params: AddHabitDto, userId: number) {
    const habit = this.habitRepository.create();
    habit.user = userId;
    habit.name = params.name;
    habit.frequency = params.frequency;
    habit.notifyFlag = params.notifyFlag;
    habit.notifyTime = params.notifyTime;
    habit.frequencyDay = params.frequencyDay;
    habit.frequencyWeek = params.frequencyWeek;
    return await this.habitRepository.save(habit);
  }

  async updateLetter(body: UpdateHabitDto | UpdateHabitStatusDto) {
    const { habitId, ...params } = body;
    const qb = this.habitRepository.createQueryBuilder('habit');
    return await qb
      .update(Habit)
      .set(params)
      .where('habit.habitId = :habitId', { habitId })
      .execute();
  }

  async delLetter(body: DelHabitDto) {
    return await this.habitRepository.delete({ habitId: body.habitId });
  }
}
