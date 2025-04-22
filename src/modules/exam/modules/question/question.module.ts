import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question } from '../../entities/question.entity';
import { QuestionType } from '../../entities/questionType.entity';
import { QuestionTypeComplete } from '../../entities/questionTypeComplete.entity';
import { User } from '@src/modules/admin/system/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      QuestionType,
      QuestionTypeComplete,
      User,
    ]),
  ],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}
