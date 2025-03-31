import { Module } from '@nestjs/common';
import { QuestionModule } from './modules/question/question.module';
import { StudyRoomModule } from './modules/studyRoom/studyRoom.module';
@Module({
  imports: [QuestionModule, StudyRoomModule],
  providers: [],
  controllers: [],
})
export class ExamSystemModule {}
