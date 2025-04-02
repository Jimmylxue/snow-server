import { Module } from '@nestjs/common';
import { QuestionModule } from './modules/question/question.module';
import { StudyRoomModule } from './modules/studyRoom/studyRoom.module';
import { ExamRecordModule } from './modules/examRecord/examRecord.module';
@Module({
  imports: [QuestionModule, StudyRoomModule, ExamRecordModule],
  providers: [],
  controllers: [],
})
export class ExamSystemModule {}
