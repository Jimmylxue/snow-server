import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course } from '../../entities/course.entity';
import { CourseType } from '../../entities/courseType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, CourseType])],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
