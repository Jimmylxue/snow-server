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
  BuyCourseDto,
} from '../../dto/course.dto';
import { Course } from '../../entities/course.entity';
import { CourseOrder } from '../../entities/courseOrder.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseType)
    private readonly courseTypeRepository: Repository<CourseType>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(CourseOrder)
    private readonly courseOrderRepository: Repository<CourseOrder>,
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

  /**
   * 是否有这个订单数据
   */
  async whetherHasCourse(courseId: number, userId: number) {
    return await this.courseOrderRepository.findOneBy({
      userId,
      courseId,
    });
  }

  async buyCourse(params: BuyCourseDto, userId: number) {
    const whetherOrder = await this.whetherHasCourse(params.courseId, userId);
    if (whetherOrder?.id) {
      return {
        code: 500,
        result: '您已经购买该课程',
      };
    }
    const order = this.courseOrderRepository.create();
    order.user = userId;
    order.userId = userId;
    order.course = params.courseId;
    order.courseId = params.courseId;
    await this.courseOrderRepository.save(order);
    return {
      code: 200,
      result: '操作成功',
    };
  }

  async getUserCourseOrder(userId: number) {
    return await this.courseOrderRepository.find({
      relations: {
        course: true,
      },
      where: {
        userId,
      },
      order: {
        id: 'DESC',
      },
    });
  }
}
