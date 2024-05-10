import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question } from '../../entities/question.entity';
import { QuestionType } from '../../entities/questionType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionType])],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}
