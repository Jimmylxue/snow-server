import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../../entities/question.entity';
import { QuestionType } from '../../entities/questionType.entity';
import { StudyRoomService } from './studyRoom.service';
import { StudyRoomController } from './studyRoom.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionType])],
  providers: [StudyRoomService],
  controllers: [StudyRoomController],
})
export class StudyRoomModule {}
