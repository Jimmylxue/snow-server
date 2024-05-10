import { Module } from '@nestjs/common';
import { QuestionModule } from './modules/question/question.module';

@Module({
  imports: [QuestionModule],
  providers: [],
  controllers: [],
})
export class ExamSystemModule {}
