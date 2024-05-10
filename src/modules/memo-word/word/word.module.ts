import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from '../entities/words.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Word]), HttpModule],
  providers: [WordService],
  controllers: [WordController],
})
export class WordModule {}
