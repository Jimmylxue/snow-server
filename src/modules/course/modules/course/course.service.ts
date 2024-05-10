import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseType } from '../../entities/courseType.entity';
import {
  AddCourseTypeDto,
  DelCourseTypeDto,
  AddCourseDto,
  DelCourseDto,
  RandomCourseDto,
} from '../../dto/course.dto';
import { Course } from '../../entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseType)
    private readonly courseTypeRepository: Repository<CourseType>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async addCourseType(params: AddCourseTypeDto) {
    const type = this.courseTypeRepository.create();
    type.name = params.name;
    type.desc = params.desc;
    return await this.courseTypeRepository.save(type);
  }

  async delCourseType(params: DelCourseTypeDto) {
    return await this.courseTypeRepository.delete({ id: params.id });
  }

  async addCourse(params: AddCourseDto, userId: number) {
    const course = this.courseRepository.create();
    course.name = params.name;
    course.desc = params.desc;
    course.typeId = params.typeId;
    course.type = params.typeId;
    course.user = userId;
    course.userId = userId;
    course.source = params.source;
    course.cover = params.cover;
    return await this.courseRepository.save(course);
  }

  async delCourse(params: DelCourseDto) {
    return await this.courseRepository.delete({ id: params.id });
  }

  async getRandomCourse(params: RandomCourseDto) {
    const qb = this.courseRepository.createQueryBuilder('question');
    return await qb
      .orderBy('RAND()')
      .take(params.count || 10)
      .getMany();
  }
}
