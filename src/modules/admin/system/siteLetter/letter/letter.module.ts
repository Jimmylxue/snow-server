import { Module } from '@nestjs/common';
import { LetterService } from './letter.service';
import { LetterController } from './letter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Letter } from '../entities/letter.entity';
import { SendRecord } from '../entities/sendRecord.entity';
import { SendLetterService } from '../sendLetter/sendLetter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Letter, SendRecord])],
  providers: [LetterService, SendLetterService],
  controllers: [LetterController],
})
export class LetterModule {}
