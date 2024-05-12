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
  CourseTypeListDto,
  CourseListDto,
  EditCourseDto,
  EditCourseTypeDto,
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

  async getAllList(body: CourseTypeListDto) {
    return await this.courseTypeRepository.find({
      // select: ['recordId', 'letter', 'status', 'createdTime'],
      // relations: {
      //   letter: true,
      // },
      where: {
        ...body,
        // clubMemberId: userId,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async addCourseType(params: AddCourseTypeDto) {
    const type = this.courseTypeRepository.create();
    type.name = params.name;
    type.desc = params.desc;
    return await this.courseTypeRepository.save(type);
  }

  async delCourseType(params: DelCourseTypeDto) {
    return await this.courseTypeRepository.delete({ id: params.id });
  }

  async editCourseType(updateParams: EditCourseTypeDto) {
    const { id, ...params } = updateParams;
    const qb = this.courseTypeRepository.createQueryBuilder('courseType');
    qb.update(CourseType)
      .set(params)
      .where('courseType.id = :id', { id })
      .execute();
    return { status: 1, message: '更新成功' };
  }

  async getAllCourseList(body: CourseListDto) {
    return await this.courseRepository.find({
      // select: ['recordId', 'letter', 'status', 'createdTime'],
      // relations: {
      //   letter: true,
      // },
      where: {
        ...body,
        // clubMemberId: userId,
      },
      order: {
        id: 'DESC',
      },
    });
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

  async editCourse(updateParams: EditCourseDto) {
    const { id, ...params } = updateParams;
    const qb = this.courseRepository.createQueryBuilder('course');
    qb.update(Course).set(params).where('course.id = :id', { id }).execute();
    return { status: 1, message: '更新成功' };
  }

  async getRandomCourse(params: RandomCourseDto) {
    const qb = this.courseRepository.createQueryBuilder('question');
    return await qb
      .orderBy('RAND()')
      .take(params.count || 10)
      .getMany();
  }
}
