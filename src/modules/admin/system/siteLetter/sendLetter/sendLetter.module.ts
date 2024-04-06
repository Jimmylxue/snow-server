import { Module } from '@nestjs/common';
import { SendLetterService } from './sendLetter.service';
import { SendLetterController } from './sendLetter.controller';
import { LetterService } from '../letter/letter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendRecord } from '../entities/sendRecord.entity';
import { Letter } from '../entities/letter.entity';
import { User } from '../../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SendRecord, Letter, User])],
  providers: [LetterService, SendLetterService],
  controllers: [SendLetterController],
})
export class SendLetterModule {}
