import { Module } from '@nestjs/common';
import { CourseModule } from './modules/course/course.module';

@Module({
  imports: [CourseModule],
  providers: [],
  controllers: [],
})
export class CourseSystemModule {}
